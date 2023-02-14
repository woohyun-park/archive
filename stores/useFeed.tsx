import {
  collection,
  doc,
  DocumentData,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
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
  getPosts: (id: string, type: IFeedGetType) => Promise<void>;
  setPosts: (posts: IPost[]) => void;

  filteredPosts: IPost[];
  getFilteredPosts: (
    id: string,
    type: IFeedGetType,
    tag: string
  ) => Promise<void>;
  setFilteredPosts: (filteredPosts: IPost[]) => void;
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;
let lastFilteredVisible: QueryDocumentSnapshot<DocumentData>;

export const useFeed = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    filteredPosts: [] as IPost[],
    getPosts: async (id: string, type: IFeedGetType) => {
      let posts: IPost[] = [];
      await Promise.all([
        (async () => {
          const user = await getDataByRef<IUser>(doc(db, "users", id));
          const q = getQueryByType(user, type, lastVisible);
          let [snap, posts] = await getPostsByQuery(q);
          posts = combinePrevAndNewData(get().posts, posts, type);
          const newLastVisible = setCursorByType(snap, type);
          if (newLastVisible) lastVisible = newLastVisible;
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
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    getFilteredPosts: async (id: string, type: IFeedGetType, tag: string) => {
      let filteredPosts: IPost[] = [];
      await Promise.all([
        (async () => {
          const user = await getDataByRef<IUser>(doc(db, "users", id));
          const q = getFilteredQueryByType(
            user,
            type,
            tag,
            lastFilteredVisible
          );
          if (!q) return [];
          let [snap, filteredPosts] = await getPostsByQuery(q);
          filteredPosts = combinePrevAndNewData(
            get().filteredPosts,
            filteredPosts,
            type
          );
          const newLastVisible = setCursorByType(snap, type);
          if (newLastVisible) lastFilteredVisible = newLastVisible;
          return filteredPosts;
        })(),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((values) => {
        filteredPosts = values[0];
      });
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
  }))
);
