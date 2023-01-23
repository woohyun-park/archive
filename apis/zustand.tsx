import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  IComment,
  IDict,
  ILike,
  IPost,
  IRoute,
  IScrap,
  ITag,
  IType,
  IUser,
} from "../custom";
import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  db,
  getData,
  getDataByRef,
  getDatasByQuery,
  getEach,
} from "./firebase";
import { Unsubscribe } from "firebase/auth";

interface IState {
  gCurUser: IUser;
  gFeed: {
    posts: IPost[];
  };
  gSearch: {
    posts: IPost[];
    tags: ITag[];
    users: IUser[];
  };
  gStatus: IStatus;
  gPage: IDict<IDict<number>>;
  gUnsubscribeUser: Unsubscribe | null;
  gUnsubscribeLikes: Unsubscribe | null;
  gUnsubscribeScraps: Unsubscribe | null;
  gInit: (id: string) => Promise<void>;
  gSetFeed: (id: string, page: number) => Promise<void>;
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

const POST_PER_PAGE = {
  feed: 5,
  sPost: 18,
  sTag: 15,
  sUser: 15,
};

async function loadFeed(id: string, page: number): Promise<IPost[]> {
  const user = await getDataByRef<IUser>(doc(db, "users", id));
  const snap = await getDocs(
    query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      limit(page * POST_PER_PAGE.feed)
    )
  );
  const posts: IPost[] = [];
  for (const doc of snap.docs) {
    const post: IPost = doc.data() as IPost;
    const uid = post.uid;
    const pid = post.id || "";
    const author: IUser = await getData<IUser>("users", uid);
    const likes = await getEach<ILike>("likes", pid);
    const scraps = await getEach<IScrap>("scraps", pid);
    const comments = await getEach<IComment>("comments", pid);
    post.likes = likes ? likes : [];
    post.scraps = scraps ? scraps : [];
    post.comments = comments ? comments : [];
    post.author = author;
    post.createdAt = (post.createdAt as Timestamp).toDate();
    posts.push(post);
  }
  return posts;
}
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
        limit(page * POST_PER_PAGE.sPost)
      )
    );
  } else if (type === "sTag") {
    return await getDatasByQuery<T>(
      query(
        collection(db, "tags"),
        orderBy("name"),
        startAt(keyword === undefined ? "" : keyword),
        endAt((keyword === undefined ? "" : keyword) + "\uf8ff"),
        limit(page * POST_PER_PAGE.sTag)
      )
    );
  } else {
    return await getDatasByQuery<T>(
      query(
        collection(db, "users"),
        orderBy("displayName"),
        startAt(keyword),
        endAt(keyword + "\uf8ff"),
        limit(page * POST_PER_PAGE.sUser)
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
          likes: get().gCurUser.likes,
          scraps: get().gCurUser.scraps,
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
          gCurUser: { ...get().gCurUser, likes: datas },
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
          gCurUser: { ...get().gCurUser, scraps: datas },
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
    likes: likes,
    scraps: scraps,
  };
  const posts = await loadFeed(id, get().gPage.feed.post);
  const search = {
    posts: await loadSearch<IPost>("sPost", get().gPage.feed.post),
    tags: [],
    users: [],
  };
  const keyword = "";

  return {
    gCurUser: curUser,
    gFeed: {
      posts,
    },
    gSearch: search,
    gStatus: {
      ...get().gStatus,
      keyword,
    },
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
    gFeed: {
      posts: [] as IPost[],
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
      feed: {
        post: 1,
      },
      search: {
        post: 1,
        tag: 1,
        user: 1,
      },
    },
    gUnsubscribeUser: null,
    gUnsubscribeLikes: null,
    gUnsubscribeScraps: null,
    gInit: async (id: string) => {
      const { unsubscribeUser, unsubscribeLikes, unsubscribeScraps } =
        await loadListener(set, get, id);
      const loadedState = await loadstate(get, id);
      set((state: IState) => {
        return {
          ...state,
          ...loadedState,
          gUnsubscribeUser: unsubscribeUser,
          gUnsubscribeLikes: unsubscribeLikes,
          gUnsubscribeScraps: unsubscribeScraps,
        };
      });
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
    gSetFeed: async (id: string, page: number) => {
      if (page === 1) return;
      const posts = await loadFeed(id, get().gPage.feed.post);
      set((state: IState) => {
        return {
          ...state,
          gFeed: {
            posts,
          },
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
        console.log("tags", tags!);
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
        const users = await loadSearch<IUser>("sUser", page);
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
