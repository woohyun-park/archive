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
  combinePrevAndNewPosts,
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
  getFilteredPosts: (id: string, tag: string) => Promise<void>;
}

let feedLastVisible: QueryDocumentSnapshot<DocumentData>;

export const useFeed = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    filteredPosts: [] as IPost[],
    getPosts: async (id: string, type: IFeedGetType) => {
      let posts: IPost[] = [];
      await Promise.all([
        (async () => {
          const user = await getDataByRef<IUser>(doc(db, "users", id));
          const q = getQueryByType(user, type, feedLastVisible);
          let [snap, posts] = await getPostsByQuery(q);
          posts = combinePrevAndNewPosts(get().posts, posts, type);
          const lastVisible = setCursorByType(snap, type);
          if (lastVisible) feedLastVisible = lastVisible;
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
    getFilteredPosts: async (id: string, tag: string) => {
      const user = await getDataByRef<IUser>(doc(db, "users", id));
      const q = query(
        collection(db, "posts"),
        where("uid", "in", [...user.followings, id]),
        where("tags", "array-contains", tag),
        orderBy("createdAt", "desc")
      );
      const [snap, posts] = await getPostsByQuery(q);
      set((state: IFeedStore) => {
        return {
          ...state,
          filteredPosts: posts,
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
  }))
);
