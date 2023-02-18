import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict, IPost, IRoute, ITag, IType, IUser } from "../libs/custom";
import {
  collection,
  endAt,
  limit,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { db } from "../apis/firebase";
import { readDatasByQuery } from "../apis/fbRead";

interface IState {
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
    return await readDatasByQuery<T>(
      query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(page * POST_PER_PAGE.search.post)
      )
    );
  } else if (type === "sTag") {
    return await readDatasByQuery<T>(
      query(
        collection(db, "tags"),
        orderBy("name"),
        startAt(keyword === undefined ? "" : keyword),
        endAt((keyword === undefined ? "" : keyword) + "\uf8ff"),
        limit(page * POST_PER_PAGE.search.tag)
      )
    );
  } else {
    return await readDatasByQuery<T>(
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
async function loadstate(get: () => IState, id: string) {
  const search = {
    posts: await loadSearch<IPost>("sPost", get().gPage.search.post),
    tags: [],
    users: [],
  };

  return {
    gSearch: search,
  };
}

export const useStore = create<IState>()(
  devtools((set, get) => ({
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
