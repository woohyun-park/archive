import {
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { IAlarm, IDict, IPost } from "../libs/custom";
import {
  FETCH_LIMIT,
  getAlarmQuery,
  getSearchQueryByType,
  getTagQuery,
  IFetchType,
} from "../apis/fbQuery";
import { combineData, setCursor } from "./libStores";
import { readAlarm, readPost } from "../apis/fbRead";

interface IUseCache {
  caches: IDict<IPage>;
  fetchAlarms: (
    fetchType: IFetchType,
    pathname: string,
    uid: string
  ) => Promise<void>;
  fetchPosts: (fetchType: IFetchType, pathname: string) => Promise<void>;
  fetchTaggedPosts: (
    fetchType: IFetchType,
    pathname: string,
    tag: string
  ) => Promise<void>;
}

type IPage = IDict<ICache>;

interface ICache {
  data: any[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData>;
}

async function readAlarms(fetchType: IFetchType, cache: ICache, uid: string) {
  const snap = await getDocs(getAlarmQuery(fetchType, uid, cache.lastVisible));
  const resAlarms: IAlarm[] = [];
  for await (const doc of snap.docs) {
    const alarm = await readAlarm(doc.data().id);
    resAlarms.push(alarm);
  }
  cache.data = combineData(cache.data, resAlarms, fetchType);
  cache.isLast = resAlarms.length < FETCH_LIMIT.alarm ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function readPosts(fetchType: IFetchType, cache: ICache) {
  const snap = await getDocs(
    getSearchQueryByType(fetchType, cache.lastVisible)
  );
  const resPosts: IPost[] = [];
  for await (const doc of snap.docs) {
    const post = await readPost(doc.data().id);
    resPosts.push(post);
  }
  cache.data = combineData(cache.data, resPosts, fetchType);
  cache.isLast = resPosts.length < FETCH_LIMIT.post3 ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

async function readTaggedPosts(
  fetchType: IFetchType,
  cache: ICache,
  tag: string
) {
  const snap = await getDocs(getTagQuery(fetchType, tag, cache.lastVisible));
  const resPosts: IPost[] = [];
  for await (const doc of snap.docs) {
    const post = await readPost(doc.data().id);
    resPosts.push(post);
  }
  cache.data = combineData(cache.data, resPosts, fetchType);
  cache.isLast = resPosts.length < FETCH_LIMIT.post1 ? true : false;
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
      const cache = await readAlarms(fetchType, { ...alarms }, uid);
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
      const cache = await readPosts(fetchType, { ...posts });
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { posts: cache };
        else newState.caches[pathname].posts = cache;
        return newState;
      });
    },
    fetchTaggedPosts: async (
      fetchType: IFetchType,
      pathname: string,
      tag: string
    ) => {
      const taggedPosts = get().caches[pathname]?.taggedPosts;
      const cache = await readTaggedPosts(fetchType, { ...taggedPosts }, tag);
      set((state: IUseCache) => {
        const newState = { ...state };
        if (!newState.caches[pathname])
          newState.caches[pathname] = { taggedPosts: cache };
        else newState.caches[pathname].taggedPosts = cache;
        return newState;
      });
    },
  }))
);
