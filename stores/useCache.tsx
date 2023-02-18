import {
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { IAlarm, IDict } from "../libs/custom";
import { FETCH_LIMIT, getAlarmQuery, IFetchType } from "../apis/fbQuery";
import { combineData, setCursor, wrapPromise } from "./libStores";
import { readAlarm } from "../apis/fbRead";

interface IUseCache {
  caches: IDict<ICache>;
  setCaches: (pathname: string, data: IDict<any>[]) => void;
  getCaches: (type: IFetchType, pathname: string, uid: string) => Promise<void>;
}

interface ICache {
  data: IDict<any>[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData>;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
    setCaches: (pathname: string, data: IDict<any>[]) => {
      set((state: IUseCache) => {
        const cache = state.caches[pathname];
        const newData = { ...state.caches, [pathname]: { ...cache, data } };
        return {
          ...state,
          cache: newData,
        };
      });
    },
    getCaches: async (type: IFetchType, pathname: string, uid: string) => {
      const cache = { ...get().caches[pathname] };
      const snap = await getDocs(getAlarmQuery(type, cache.lastVisible, uid));
      const resAlarms: IAlarm[] = [];
      for await (const doc of snap.docs) {
        const alarm = await readAlarm(doc.data().id);
        resAlarms.push(alarm);
      }
      cache.data = combineData(cache.data, resAlarms, type);
      cache.isLast = resAlarms.length < FETCH_LIMIT.alarm ? true : false;
      const newLastVisible = setCursor(snap, type);
      if (newLastVisible) cache.lastVisible = newLastVisible;
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
