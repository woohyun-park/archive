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
  IFetchType,
} from "../apis/fbQuery";
import { combineData, setCursor } from "./libStores";
import { readAlarm, readPost } from "../apis/fbRead";
import { IDataType } from "../apis/firebase";

interface IUseCache {
  caches: IDict<ICache>;
  getCaches: (
    dataType: IDataType,
    fetchType: IFetchType,
    pathname: string,
    uid?: string
  ) => Promise<void>;
}

interface ICache {
  data: IDict<any>[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData>;
}

async function getAlarms(fetchType: IFetchType, cache: ICache, uid: string) {
  const snap = await getDocs(getAlarmQuery(fetchType, cache.lastVisible, uid));
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

async function getPosts(fetchType: IFetchType, cache: ICache) {
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

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
    getCaches: async (
      dataType: IDataType,
      fetchType: IFetchType,
      pathname: string,
      uid?: string
    ) => {
      let cache: ICache;
      const prevCache = { ...get().caches[pathname] };
      if (dataType === "alarms" && uid)
        cache = await getAlarms(fetchType, prevCache, uid);
      if (dataType === "posts") cache = await getPosts(fetchType, prevCache);
      set((state: IUseCache) => {
        return {
          ...state,
          caches: {
            ...state.caches,
            [pathname]: cache,
          },
        };
      });
    },
  }))
);
