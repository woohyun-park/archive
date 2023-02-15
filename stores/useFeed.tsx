import { doc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { db, getDataByRef } from "../apis/firebase";
import { IPost, IUser } from "../libs/custom";
import {
  combinePrevAndNewData,
  getFilteredQueryByType,
  getPostsByQuery,
  getQueryByType,
  setCursorByType,
} from "./useFeedHelper";

export type IFeedGetType = "init" | "load" | "refresh";

interface IFeedStore {
  posts: IPost[];
  filteredPosts: IPost[];
  refresh: boolean;
  isLast: boolean;
  getPosts: (id: string, type: IFeedGetType) => Promise<void>;
  getFilteredPosts: (
    id: string,
    type: IFeedGetType,
    tag: string
  ) => Promise<void>;
  setPosts: (posts: IPost[]) => void;
  setFilteredPosts: (filteredPosts: IPost[]) => void;
  setRefresh: (refresh: boolean) => void;
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;
let lastFilteredVisible: QueryDocumentSnapshot<DocumentData>;

async function getPostsHelper(
  id: string,
  type: IFeedGetType,
  prevPosts: IPost[],
  tag?: string
) {
  let posts: IPost[] = [];
  await Promise.all([
    (async () => {
      const user = await getDataByRef<IUser>(doc(db, "users", id));
      const q = tag
        ? getFilteredQueryByType(user, type, tag, lastFilteredVisible)
        : getQueryByType(user, type, lastVisible);
      let [snap, posts] = await getPostsByQuery(q);
      posts = combinePrevAndNewData(prevPosts, posts, type);
      const newLastVisible = setCursorByType(snap, type);
      if (newLastVisible)
        tag
          ? (lastFilteredVisible = newLastVisible)
          : (lastVisible = newLastVisible);
      return posts;
    })(),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(0);
      }, 1000);
    }),
  ]).then((values) => {
    posts = values[0];
  });
  return posts;
}

export const useFeed = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    filteredPosts: [] as IPost[],
    refresh: false,
    isLast: false,
    getPosts: async (id: string, type: IFeedGetType) => {
      const posts = await getPostsHelper(id, type, get().posts);
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    getFilteredPosts: async (id: string, type: IFeedGetType, tag: string) => {
      const filteredPosts = await getPostsHelper(
        id,
        type,
        get().filteredPosts,
        tag
      );
      set((state: IFeedStore) => {
        return {
          ...state,
          filteredPosts,
        };
      });
    },
    setPosts: (posts: IPost[]) => {
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    setFilteredPosts: (filteredPosts: IPost[]) => {
      set((state: IFeedStore) => {
        return { ...state, filteredPosts };
      });
    },
    setRefresh: (refresh: boolean) => {
      set((state: IFeedStore) => {
        return { ...state, refresh };
      });
    },
  }))
);
