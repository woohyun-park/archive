import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";
import { getPostsQuery, getTagsQuery } from "../apis/fbQuery";
import {
  fetchAlarmsHelper,
  fetchPostsHelper,
  fetchScrapsHelper,
  fetchTagsHelper,
  fetchUsersByKeywordHelper,
  getNewState,
  ICache,
} from "./useCacheHelper";
import { type } from "os";

export interface IUseCache {
  caches: IDict<IPage>;
  fetchUsersByKeyword: (
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
    query: IFetchQueryPosts,
    pathname: string,
    as: string,
    numCols: number
  ) => Promise<void>;
  fetchTags: (
    type: IFetchType,
    query: IFetchQueryTags,
    pathname: string,
    as: string
  ) => Promise<void>;
}

type IPage = IDict<ICache>;

export type IFetchType = "init" | "load" | "refresh";

export type IFetchQueryPosts = {
  type:
    | "none"
    | "follow"
    | "followAndTag"
    | "keyword"
    | "tag"
    | "uid"
    | "uidAndTag";
  value: IDict<any>;
};

export type IFetchQueryTags = {
  type: "keyword" | "uid";
  value: IDict<any>;
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
      query: IFetchQueryPosts,
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
      set((state: IUseCache) => getNewState(as, state, cache, pathname));
    },

    fetchTags: async (
      type: IFetchType,
      query: IFetchQueryTags,
      pathname: string,
      as: string
    ) => {
      console.log("fetchTags", type, query, pathname, as);
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      const cache = await fetchTagsHelper(
        type,
        FETCH_LIMIT.tag,
        getTagsQuery(type, query, FETCH_LIMIT.tag, prevCache?.lastVisible),
        prevCache
      );
      console.log("fetchTags", cache);
      set((state: IUseCache) => getNewState(as, state, cache, pathname));
    },

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
  }))
);
