import {
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { IAlarm, IDict, IPost, ITag, IUser } from "../libs/custom";
import {
  FETCH_LIMIT,
  getAlarmQuery,
  getPostsByKeywordQuery,
  getPostsByTagQuery,
  getPostsQuery,
  getTagsQuery,
  getUsersByKeywordQuery,
  IFetchType,
} from "../apis/fbQuery";
import { combineData, setCursor } from "./libStores";
import {
  readAlarm,
  readAlarms,
  readDatasByQuery,
  readPost,
  readPosts,
  readUsers,
} from "../apis/fbRead";

interface IUseCache {
  caches: IDict<IPage>;
  fetchAlarms: (
    fetchType: IFetchType,
    pathname: string,
    uid: string
  ) => Promise<void>;
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
  fetchTags: (
    fetchType: IFetchType,
    pathname: string,
    keyword: string
  ) => Promise<void>;
  fetchUsersByKeyword: (
    fetchType: IFetchType,
    pathname: string,
    keyword: string
  ) => Promise<void>;
}

type IPage = IDict<ICache>;

interface ICache {
  data: any[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData>;
}

async function fetchAlarmsHelper(
  fetchType: IFetchType,
  cache: ICache,
  uid: string
) {
  const snap = await getDocs(getAlarmQuery(fetchType, uid, cache.lastVisible));
  const resAlarms = await readAlarms(snap.docs);
  cache.data = combineData(cache.data, resAlarms, fetchType);
  cache.isLast = resAlarms.length < FETCH_LIMIT.alarm ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function fetchPostsHelper(fetchType: IFetchType, cache: ICache) {
  const snap = await getDocs(getPostsQuery(fetchType, cache.lastVisible));
  const resPosts = await readPosts(snap.docs);
  cache.data = combineData(cache.data, resPosts, fetchType);
  cache.isLast = resPosts.length < FETCH_LIMIT.post3 ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function fetchPostsByTagHelper(
  fetchType: IFetchType,
  cache: ICache,
  tag: string
) {
  const snap = await getDocs(
    getPostsByTagQuery(fetchType, tag, cache.lastVisible)
  );
  const resPosts = await readPosts(snap.docs);
  cache.data = combineData(cache.data, resPosts, fetchType);
  cache.isLast = resPosts.length < FETCH_LIMIT.post1 ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function fetchPostsByKeywordHelper(
  fetchType: IFetchType,
  cache: ICache,
  keyword: string
) {
  const snap = await getDocs(
    getPostsByKeywordQuery(fetchType, keyword, cache.lastVisible)
  );
  const resPosts = await readPosts(snap.docs);
  cache.data = combineData(cache.data, resPosts, fetchType);
  cache.isLast = resPosts.length < FETCH_LIMIT.post1 ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function fetchTagsHelper(
  fetchType: IFetchType,
  cache: ICache,
  keyword: string
) {
  const q = getTagsQuery(fetchType, keyword, cache.lastVisible);
  const snap = await getDocs(q);
  const resTags: any[] = [];
  snap.forEach((doc) => resTags.push(doc.data()));
  cache.data = combineData(cache.data, resTags, fetchType);
  cache.isLast = resTags.length < FETCH_LIMIT.tag ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function fetchUsersByKeywordHelper(
  fetchType: IFetchType,
  cache: ICache,
  keyword: string
) {
  const snap = await getDocs(
    getUsersByKeywordQuery(fetchType, keyword, cache.lastVisible)
  );
  const resUsers = await readUsers(snap.docs);
  cache.data = combineData(cache.data, resUsers, fetchType);
  cache.isLast = resUsers.length < FETCH_LIMIT.user ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},

    fetchAlarms: async (
      fetchType: IFetchType,
      pathname: string,
      uid: string
    ) => {
      const alarms = get().caches[pathname]?.alarms;
      const cache = await fetchAlarmsHelper(fetchType, { ...alarms }, uid);
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { alarms: cache };
        else newState.caches[pathname].alarms = cache;

        return newState;
      });
    },
    fetchPosts: async (fetchType: IFetchType, pathname: string) => {
      const posts = get().caches[pathname]?.posts;
      const cache = await fetchPostsHelper(fetchType, { ...posts });
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { posts: cache };
        else newState.caches[pathname].posts = cache;
        return newState;
      });
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
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { postsByTag: cache };
        else newState.caches[pathname].postsByTag = cache;
        return newState;
      });
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
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { postsByKeyword: cache };
        else newState.caches[pathname].postsByKeyword = cache;
        return newState;
      });
    },
    fetchTags: async (
      fetchType: IFetchType,
      pathname: string,
      keyword: string
    ) => {
      const tags = get().caches[pathname]?.tags;
      const cache = await fetchTagsHelper(fetchType, { ...tags }, keyword);
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { tags: cache };
        else newState.caches[pathname].tags = cache;
        return newState;
      });
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
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { usersByKeyword: cache };
        else newState.caches[pathname].usersByKeyword = cache;
        return newState;
      });
    },
  }))
);
