import create from "zustand";
import { devtools } from "zustand/middleware";
import { IComment, IDict, ILike, IPost, IScrap, ITag, IUser } from "../custom";
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

interface ICurUserState {
  gCurUser: IUser;
  gFeed: {
    posts: IPost[];
  };
  gSearch: {
    posts: IPost[];
    tags: ITag[];
    users: IUser[];
  };
  gPage: {
    feed: number;
    sPost: number;
    sTag: number;
    sUser: number;
  };
  gModal: {
    isOpen: boolean;
  };
  gKeyword: string;

  gInit: (id: string) => Promise<void>;
  gSetKeyword: (keyword: string) => void;
  gSetPage: (type: IPageType, page: number) => void;
  gSetFeed: (id: string, page: number) => Promise<void>;
  gSetSearch: (
    type: ISearchType,
    page: number,
    keyword?: string
  ) => Promise<void>;

  gUnsubscribeUser: Unsubscribe | null;
  gUnsubscribeLikes: Unsubscribe | null;
  gUnsubscribeScraps: Unsubscribe | null;
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
      | ICurUserState
      | Partial<ICurUserState>
      | ((state: ICurUserState) => ICurUserState | Partial<ICurUserState>),
    replace?: boolean | undefined
  ) => void,
  get: () => ICurUserState,
  id: string
): Promise<{
  unsubscribeUser: Unsubscribe;
  unsubscribeLikes: Unsubscribe;
  unsubscribeScraps: Unsubscribe;
}> {
  const unsubscribeUser = onSnapshot(doc(db, "users", id), (doc) => {
    set((state) => {
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
      set((state) => {
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
      set((state) => {
        return {
          ...state,
          gCurUser: { ...get().gCurUser, scraps: datas },
        };
      });
    }
  );
  return { unsubscribeUser, unsubscribeLikes, unsubscribeScraps };
}
async function loadState(get: () => ICurUserState, id: string) {
  const user = await getDoc(doc(db, "users", id));
  const likes = await getEach<ILike>("likes", id);
  const scraps = await getEach<IScrap>("scraps", id);
  const curUser = {
    ...(user.data() as IUser),
    likes: likes,
    scraps: scraps,
  };
  const posts = await loadFeed(id, get().gPage.feed);
  const search = {
    posts: await loadSearch<IPost>("sPost", get().gPage.sPost),
    // tags: await loadSearch<ITag>("sTag", get().gPage.sTag),
    // users: await loadSearch<IUser>("sUser", get().gPage.sUser),
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
    gKeyword: keyword,
  };
}

export const useStore = create(
  devtools((set, get) => ({
    gCurUser: {
      id: "",
      email: "",
      displayName: "",
      photoURL:
        "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
      txt: "",
      followers: [],
      followings: [],
    },
    gFeed: {
      posts: [],
    },
    gPage: {
      feed: 1,
      sPost: 1,
      sTag: 1,
      sUser: 1,
    },
    gSearch: {
      posts: [],
      tags: [],
      users: [],
    },
    gModal: {
      isOpen: false,
    },
    gKeyword: "",
    gUnsubscribeUser: null,
    gUnsubscribeLikes: null,
    gUnsubscribeScraps: null,

    gInit: async (id: string) => {
      const { unsubscribeUser, unsubscribeLikes, unsubscribeScraps } =
        await loadListener(set, get, id);
      const loadedState = await loadState(get, id);
      set((state) => {
        return {
          ...state,
          ...loadedState,
          gUnsubscribeUser: unsubscribeUser,
          gUnsubscribeLikes: unsubscribeLikes,
          gUnsubscribeScraps: unsubscribeScraps,
        };
      });
    },
    gSetKeyword: (keyword: string) => {
      console.log("gSetKeyword", keyword);
      set((state) => {
        return {
          ...state,
          gKeyword: keyword,
        };
      });
    },

    gSetPage: (type: IPageType, page: number) => {
      set((state) => {
        return {
          ...state,
          gPage: {
            ...state.gPage,
            [type]: page,
          },
        };
      });
    },
    gSetFeed: async (id: string, page: number) => {
      if (page === 1) return;
      const posts = await loadFeed(id, get().gPage.feed);
      set((state) => {
        return {
          ...state,
          gFeed: {
            posts,
          },
        };
      });
    },
    gSetSearch: async (type: ISearchType, page: number, keyword?: string) => {
      console.log("gSetSearch", type, page, keyword);
      if (type === "posts" && page === 1) return;
      if (type === "posts") {
        const posts = await loadSearch<IPost>("sPost", page);
        set((state) => {
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
        set((state) => {
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
        set((state) => {
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
