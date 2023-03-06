import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";
import { fetchHelper, getNewState, ICache, ICacheType } from "./useCacheHelper";
import { FETCH_LIMIT, IFetchQueryPosts, IFetchType } from "../apis/fbDef";

type IPage = IDict<ICache>;

export interface IUseCache {
  caches: IDict<IPage>;
  // fetchPost: (query: IFetchQueryPost, pathname: string) => Promise<void>;
  fetchCache: (
    cacheType: ICacheType,
    fetchType: IFetchType,
    query: IFetchQueryPosts,
    pathname: string,
    as: string,
    numCols?: number
  ) => Promise<void>;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
    fetchCache: async (
      cacheType: ICacheType,
      fetchType: IFetchType,
      query: IFetchQueryPosts,
      pathname: string,
      as: string,
      numCols?: number
    ) => {
      if (!numCols) numCols = 1;
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      const cache = await fetchHelper(
        cacheType,
        fetchType,
        cacheType === "posts"
          ? FETCH_LIMIT.posts[numCols]
          : FETCH_LIMIT[cacheType],
        query,
        prevCache
      );
      set((state: IUseCache) =>
        getNewState(as || cacheType, state, cache, pathname)
      );
    },
  }))
);
