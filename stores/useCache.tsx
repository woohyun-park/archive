import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict, IPost, IUser } from "../libs/custom";

interface IUseCache {
  cachedPosts: IDict<IPost>;
  cachedUsers: IDict<IUser>;

  setCachedPosts: (posts: IDict<IPost>) => void;
  setCachedUsers: (users: IDict<IUser>) => void;

  deleteCachedPosts: (pid: string) => void;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    cachedPosts: {},
    cachedUsers: {},

    setCachedPosts: (posts: IDict<IPost>) => {
      set((state: IUseCache) => {
        return {
          ...state,
          cachedPosts: { ...state.cachedPosts, ...posts },
        };
      });
    },
    setCachedUsers: (users: IDict<IUser>) => {
      set((state: IUseCache) => {
        return {
          ...state,
          cachedUsers: { ...state.cachedUsers, ...users },
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
