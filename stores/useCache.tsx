import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict, IPost, IUser } from "../libs/custom";

interface IUseCache {
  cachedPosts: IDict<IPost>;

  setCachedPosts: (posts: IDict<IPost>) => void;

  deleteCachedPosts: (pid: string) => void;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    cachedPosts: {},

    setCachedPosts: (posts: IDict<IPost>) => {
      set((state: IUseCache) => {
        return {
          ...state,
          cachedPosts: { ...state.cachedPosts, ...posts },
        };
      });
    },

    deleteCachedPosts: (pid: string) => {
      set((state: IUseCache) => {
        const cachedPosts = { ...state.cachedPosts };
        delete cachedPosts[pid];
        return {
          ...state,
          cachedPosts,
        };
      });
    },
  }))
);
