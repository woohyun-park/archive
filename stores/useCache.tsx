import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";
import { getPostsQuery, IFetchType } from "../apis/fbQuery";
import {
  fetchAlarmsHelper,
  fetchPostsByKeywordHelper,
  fetchPostsByTagHelper,
  fetchPostsByUidHelper,
  fetchPostsHelper,
  fetchScrapsHelper,
  fetchTagsHelper,
  fetchUsersByKeywordHelper,
  getNewState,
  getNewStateTest,
  ICache,
  testHelper,
} from "./useCacheHelper";
import { DocumentData, Query } from "firebase/firestore";

export interface IUseCache {
  caches: IDict<IPage>;
  fetchPosts: (fetchType: IFetchType, pathname: string) => Promise<void>;
  fetchPostsByTag: (
    fetchType: IFetchType,
    pathname: string,
    tag: string
  ) => Promise<void>;
  fetchPostsByKeyword: (
    fetchType: IFetchType,
    pathname: string,
    keyword: string
  ) => Promise<void>;
  fetchPostsByUid: (
    fetchType: IFetchType,
    pathname: string,
    uid: string
  ) => Promise<void>;
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

  fetchTest: (
    fetchType: IFetchType,
    fetchLimit: number,
    pathname: string,
    key: string
  ) => Promise<void>;
}

type IPage = IDict<ICache>;

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},

    fetchTest: async (
      fetchType: IFetchType,
      fetchLimit: number,
      pathname: string,
      key: string
    ) => {
      console.log("fetchTest");
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][key]
        : undefined;
      const cache = await testHelper(
        fetchType,
        fetchLimit,
        getPostsQuery(fetchType),
        prevCache
      );
      set((state: IUseCache) => getNewStateTest(pathname, key, state, cache));
    },

    fetchPosts: async (fetchType: IFetchType, pathname: string) => {
      const posts = get().caches[pathname]?.posts;
      const cache = await fetchPostsHelper(fetchType, { ...posts });
      set((state: IUseCache) => getNewState("posts", state, cache, pathname));
    },
    fetchPostsByTag: async (
      fetchType: IFetchType,
      pathname: string,
      tag: string
    ) => {
      const postsByTag = get().caches[pathname]?.postsByTag;
      const cache = await fetchPostsByTagHelper(
        fetchType,
        { ...postsByTag },
        tag
      );
      set((state: IUseCache) =>
        getNewState("postsByTag", state, cache, pathname)
      );
    },
    fetchPostsByKeyword: async (
      fetchType: IFetchType,
      pathname: string,
      keyword: string
    ) => {
      const postsByKeyword = get().caches[pathname]?.postsByKeyword;
      const cache = await fetchPostsByKeywordHelper(
        fetchType,
        { ...postsByKeyword },
        keyword
      );
      set((state: IUseCache) =>
        getNewState("postsByKeyword", state, cache, pathname)
      );
    },
    fetchPostsByUid: async (
      fetchType: IFetchType,
      pathname: string,
      uid: string
    ) => {
      const postsByUid = get().caches[pathname]?.postsByUid;
      const cache = await fetchPostsByUidHelper(
        fetchType,
        { ...postsByUid },
        uid
      );
      set((state: IUseCache) =>
        getNewState("postsByUid", state, cache, pathname)
      );
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
