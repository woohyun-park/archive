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
  getNewPostState,
  getNewState,
  getNewStateTest,
  ICache,
} from "./useCacheHelper";
import { DocumentData, Query } from "firebase/firestore";

export interface IUseCache {
  caches: IDict<IPage>;
  // fetchPostsByTag: (
  //   fetchType: IFetchType,
  //   pathname: string,
  //   tag: string
  // ) => Promise<void>;
  // fetchPostsByKeyword: (
  //   fetchType: IFetchType,
  //   pathname: string,
  //   keyword: string
  // ) => Promise<void>;
  // fetchPostsByUid: (
  //   fetchType: IFetchType,
  //   pathname: string,
  //   uid: string
  // ) => Promise<void>;
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

  // fetchPosts: (fetchType: IFetchType, pathname: string) => Promise<void>;
  fetchPosts: (
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

    //TODO: fetchPosts로 통합하는데, 아래와 같은 형식으로 여러 방식으로 쿼리할 수 있도록.
    // fetchOption: {
    //  type: "init" | "load" | "refresh";
    //  queryType: "none" | "uid" | "tag" | "keyword" 등
    //  queryValue: 여기에 Object 형식으로 쿼리하는데 uid, tag가 필요하면 {uid, tag} 이런식으로
    //  limit: number;
    // }
    fetchPosts: async (
      fetchType: IFetchType,
      fetchLimit: number,
      fetchOption: 
      pathname: string,
      key: string
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][key]
        : undefined;
      const cache = await fetchPostsHelper(
        fetchType,
        fetchLimit,
        getPostsQuery(fetchType),
        prevCache
      );
      set((state: IUseCache) => getNewPostState(pathname, key, state, cache));
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
