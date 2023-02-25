import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";
import { getPostsQuery } from "../apis/fbQuery";
import {
  fetchAlarmsHelper,
  fetchPostsHelper,
  fetchScrapsHelper,
  fetchTagsHelper,
  fetchUsersByKeywordHelper,
  getNewPostState,
  getNewState,
  ICache,
} from "./useCacheHelper";

export interface IUseCache {
  caches: IDict<IPage>;
  fetchUsersByKeyword: (
    fetchType: IFetchType,
    pathname: string,
    keyword: string
  ) => Promise<void>;
  fetchTags: (
    fetchType: IFetchType,
    pathname: string,
    keyword: string
  ) => Promise<void>;
  fetchScraps: (
    fetchType: IFetchType,
    pathname: string,
    uid: string
  ) => Promise<void>;
  fetchAlarms: (
    fetchType: IFetchType,
    pathname: string,
    uid: string
  ) => Promise<void>;
  fetchPosts: (
    type: IFetchType,
    query: IFetchQuery,
    pathname: string,
    as: string,
    numCols: number
  ) => Promise<void>;
}

type IPage = IDict<ICache>;

export type IFetchType = "init" | "load" | "refresh";

export type IFetchQuery = {
  type: "none" | "keyword";
  value: IDict<string>;
};

export const FETCH_LIMIT = {
  post: { 1: 4, 2: 8, 3: 15 } as IDict<number>,
  user: 16,
  tag: 16,
  scrap: 15,
  comment: 16,
  alarm: 16,
};

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
    fetchPosts: async (
      type: IFetchType,
      query: IFetchQuery,
      pathname: string,
      as: string,
      numCols: number
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      const cache = await fetchPostsHelper(
        type,
        FETCH_LIMIT.post[numCols],
        getPostsQuery(
          type,
          query,
          FETCH_LIMIT.post[numCols],
          prevCache?.lastVisible
        ),
        prevCache
      );
      set((state: IUseCache) => getNewPostState(pathname, as, state, cache));
    },

    // fetchPosts: async (fetchType: IFetchType, pathname: string) => {
    //   const posts = get().caches[pathname]?.posts;
    //   const cache = await fetchPostsHelper(fetchType, { ...posts });
    //   set((state: IUseCache) => getNewState("posts", state, cache, pathname));
    // },
    // fetchPostsByTag: async (
    //   fetchType: IFetchType,
    //   pathname: string,
    //   tag: string
    // ) => {
    //   const postsByTag = get().caches[pathname]?.postsByTag;
    //   const cache = await fetchPostsByTagHelper(
    //     fetchType,
    //     { ...postsByTag },
    //     tag
    //   );
    //   set((state: IUseCache) =>
    //     getNewState("postsByTag", state, cache, pathname)
    //   );
    // },
    // fetchPostsByKeyword: async (
    //   fetchType: IFetchType,
    //   pathname: string,
    //   keyword: string
    // ) => {
    //   const postsByKeyword = get().caches[pathname]?.postsByKeyword;
    //   const cache = await fetchPostsByKeywordHelper(
    //     fetchType,
    //     { ...postsByKeyword },
    //     keyword
    //   );
    //   set((state: IUseCache) =>
    //     getNewState("postsByKeyword", state, cache, pathname)
    //   );
    // },
    // fetchPostsByUid: async (
    //   fetchType: IFetchType,
    //   pathname: string,
    //   uid: string
    // ) => {
    //   const postsByUid = get().caches[pathname]?.postsByUid;
    //   const cache = await fetchPostsByUidHelper(
    //     fetchType,
    //     { ...postsByUid },
    //     uid
    //   );
    //   set((state: IUseCache) =>
    //     getNewState("postsByUid", state, cache, pathname)
    //   );
    // },
    fetchUsersByKeyword: async (
      fetchType: IFetchType,
      pathname: string,
      keyword: string
    ) => {
      const usersByKeyword = get().caches[pathname]?.usersByKeyword;
      const cache = await fetchUsersByKeywordHelper(
        fetchType,
        { ...usersByKeyword },
        keyword
      );
      set((state: IUseCache) =>
        getNewState("usersByKeyword", state, cache, pathname)
      );
    },
    fetchAlarms: async (
      fetchType: IFetchType,
      pathname: string,
      uid: string
    ) => {
      const alarms = get().caches[pathname]?.alarms;
      const cache = await fetchAlarmsHelper(fetchType, { ...alarms }, uid);
      set((state: IUseCache) => getNewState("alarms", state, cache, pathname));
    },
    fetchScraps: async (
      fetchType: IFetchType,
      pathname: string,
      uid: string
    ) => {
      const scraps = get().caches[pathname]?.scraps;
      const cache = await fetchScrapsHelper(fetchType, { ...scraps }, uid);
      set((state: IUseCache) => getNewState("scraps", state, cache, pathname));
    },
    fetchTags: async (
      fetchType: IFetchType,
      pathname: string,
      keyword: string
    ) => {
      const tags = get().caches[pathname]?.tags;
      const cache = await fetchTagsHelper(fetchType, { ...tags }, keyword);
      set((state: IUseCache) => getNewState("tags", state, cache, pathname));
    },
  }))
);
