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
  caches: IDict<ICache>;
  fetchAlarmPage: (
    fetchType: IFetchType,
    pathname: string,
    uid: string
  ) => Promise<void>;
  fetchSearchPage: (fetchType: IFetchType, pathname: string) => Promise<void>;
  fetchTagPage: (
    fetchType: IFetchType,
    pathname: string,
    tag: string
  ) => Promise<void>;
}

interface ICache {
  data: any[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData>;
}

async function readAlarmPage(
  fetchType: IFetchType,
  cache: ICache,
  uid: string
) {
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

async function readSearchPage(fetchType: IFetchType, cache: ICache) {
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

async function readTagPage(fetchType: IFetchType, cache: ICache, tag: string) {
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

    fetchAlarmPage: async (
      fetchType: IFetchType,
      pathname: string,
      uid: string
    ) => {
      const cache = await readAlarmPage(
        fetchType,
        { ...get().caches[pathname] },
        uid
      );
      set((state: IUseCache) => {
        const newState = { ...state };
        newState.caches[pathname] = cache;
        return newState;
      });
    },

    fetchSearchPage: async (fetchType: IFetchType, pathname: string) => {
      const cache = await readSearchPage(fetchType, {
        ...get().caches[pathname],
      });
      set((state: IUseCache) => {
        const newState = { ...state };
        newState.caches[pathname] = cache;
        return newState;
      });
    },

    fetchTagPage: async (
      fetchType: IFetchType,
      pathname: string,
      tag: string
    ) => {
      const cache = await readTagPage(
        fetchType,
        {
          ...get().caches[pathname],
        },
        tag
      );
      set((state: IUseCache) => {
        const newState = { ...state };
        newState.caches[pathname] = cache;
        return newState;
      });
    },
  }))
);
