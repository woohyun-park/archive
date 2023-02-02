import { doc } from "firebase/firestore";
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
}

export const useFeed = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    getPosts: async (id: string, type: IFeedGetType) => {
      let posts: IPost[] = [];
      await Promise.all([
        (async () => {
          const user = await getDataByRef<IUser>(doc(db, "users", id));
          const q = getQueryByType(user, type);
          let [snap, posts] = await getPostsByQuery(q);
          posts = combinePrevAndNewPosts(get().posts, posts, type);
          setCursorByType(snap, type);
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