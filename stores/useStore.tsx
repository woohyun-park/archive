import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  IDict,
  ILike,
  IPost,
  IRoute,
  IScrap,
  ITag,
  IType,
  IUser,
} from "../libs/custom";
import {
  collection,
  doc,
  endAt,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { db, getDatasByQuery, getEach } from "../apis/firebase";
import { Unsubscribe } from "firebase/auth";

interface IState {
  gCurUser: IUser;
  gSearch: {
    posts: IPost[];
    tags: ITag[];
    users: IUser[];
  };
  gStatus: IStatus;
  gPage: IDict<IDict<number>>;
  gInit: (id: string) => Promise<void>;
  gSetSearch: (
    type: ISearchType,
    page: number,
    keyword?: string
  ) => Promise<void>;
  gSetStatus: (status: IStatus) => void;
  gSetPage: (route: IRoute, type: IType, page: number) => void;
}
interface IStatus {
  isModalOpen: boolean;
  keyword: string;
}

type ISearchType = "posts" | "tags" | "users";
type IPageType = "feed" | ISearchPageType;
type ISearchPageType = "sPost" | "sTag" | "sUser";

export const POST_PER_PAGE = {
  feed: {
    post: 5,
  },
  search: {
    post: 18,
    tag: 15,
    user: 15,
  },
  profile: {
    tag: 15,
    scrap: 15,
  },
};

async function loadSearch<T>(
  type: ISearchPageType,
  page: number,
  keyword?: string
): Promise<T[]> {
  if (type === "sPost") {
    return await getDatasByQuery<T>(
      query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(page * POST_PER_PAGE.search.post)
      )
    );
  } else if (type === "sTag") {
    return await getDatasByQuery<T>(
      query(
        collection(db, "tags"),
        orderBy("name"),
        startAt(keyword === undefined ? "" : keyword),
        endAt((keyword === undefined ? "" : keyword) + "\uf8ff"),
        limit(page * POST_PER_PAGE.search.tag)
      )
    );
  } else {
    return await getDatasByQuery<T>(
      query(
        collection(db, "users"),
        orderBy("displayName"),
        startAt(keyword),
        endAt(keyword + "\uf8ff"),
        limit(page * POST_PER_PAGE.search.user)
      )
    );
  }
}
async function loadListener(
  set: (
    partial:
      | IState
      | Partial<IState>
      | ((state: IState) => IState | Partial<IState>),
    replace?: boolean | undefined
  ) => void,
  get: () => IState,
  id: string
): Promise<{
  unsubscribeUser: Unsubscribe;
  unsubscribeLikes: Unsubscribe;
  unsubscribeScraps: Unsubscribe;
}> {
  const unsubscribeUser = onSnapshot(doc(db, "users", id), (doc) => {
    set((state: IState) => {
      return {
        ...state,
        gCurUser: {
          ...(doc.data() as IUser),
          likes: state.gCurUser.likes,
          scraps: state.gCurUser.scraps,
        },
      };
    });
  });
  const unsubscribeLikes = onSnapshot(
    query(collection(db, "likes"), where("uid", "==", id)),
    (snap) => {
      const datas: ILike[] = [];
      snap.forEach((doc) => {
        datas.push({ ...(doc.data() as ILike) });
      });
      set((state: IState) => {
        return {
          ...state,
          gCurUser: { ...state.gCurUser, likes: datas },
        };
      });
    }
  );
  const unsubscribeScraps = onSnapshot(
    query(collection(db, "scraps"), where("uid", "==", id)),
    (snap) => {
      const datas: IScrap[] = [];
      snap.forEach((doc) => {
        datas.push({ ...(doc.data() as IScrap) });
      });
      set((state: IState) => {
        return {
          ...state,
          gCurUser: { ...state.gCurUser, scraps: datas },
        };
      });
    }
  );
  return { unsubscribeUser, unsubscribeLikes, unsubscribeScraps };
}
async function loadstate(get: () => IState, id: string) {
  const user = await getDoc(doc(db, "users", id));
  const likes = await getEach<ILike>("likes", id);
  const scraps = await getEach<IScrap>("scraps", id);
  const curUser = {
    ...(user.data() as IUser),
    likes,
    scraps,
  };
  const search = {
    posts: await loadSearch<IPost>("sPost", get().gPage.search.post),
    tags: [],
    users: [],
  };

  return {
    gCurUser: curUser,
    gSearch: search,
  };
}

export const useStore = create<IState>()(
  devtools((set, get) => ({
    gCurUser: {
      id: "",
      email: "",
      displayName: "",
      photoURL:
        "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
      txt: "",
      followers: [] as string[],
      followings: [] as string[],
    },
    gSearch: {
      posts: [] as IPost[],
      tags: [] as ITag[],
      users: [] as IUser[],
    },
    gStatus: {
      isModalOpen: false,
      keyword: "",
    },
    gPage: {
      search: {
        post: 1,
        tag: 1,
        user: 1,
      },
      profile: {
        grid: 1,
        tag: 1,
        scrap: 1,
      },
    },
    gInit: async (id: string) => {
      const loadedState = await loadstate(get, id);
      set((state: IState) => {
        return {
          ...state,
          ...loadedState,
        };
      });
      await loadListener(set, get, id);
    },
    gSetPage: (route: IRoute, type: IType, page: number) => {
      set((state: IState) => {
        state.gPage[route][type] = page;
        return {
          ...state,
        };
      });
    },
    gSetStatus: (status: IStatus) => {
      set((state: IState) => {
        return {
          ...state,
          gStatus: status,
        };
      });
    },
    gSetSearch: async (type: ISearchType, page: number, keyword?: string) => {
      if (type === "posts" && page === 1) return;
      if (type === "posts") {
        const posts = await loadSearch<IPost>("sPost", page);
        set((state: IState) => {
          return {
            ...state,
            gSearch: {
              ...state.gSearch,
              posts,
            },
          };
        });
      } else if (type === "tags") {
        const tags = await loadSearch<ITag>("sTag", page, keyword);
        set((state: IState) => {
          return {
            ...state,
            gSearch: {
              ...state.gSearch,
              tags,
            },
          };
        });
      } else if (type === "users") {
        const users = await loadSearch<IUser>("sUser", page, keyword);
        set((state: IState) => {
          return {
            ...state,
            gSearch: {
              ...state.gSearch,
              users,
            },
          };
        });
      }
    },
  }))
);
