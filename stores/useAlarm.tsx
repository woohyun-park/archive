import {
  collection,
  DocumentData,
  endAt,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { db, getAlarmsByQuery } from "../apis/firebase";
import { IAlarm } from "../libs/custom";
import { IStoreGetType, wrapPromise } from "./libStores";
import { combinePrevAndNewData, setCursorByType } from "./useFeedHelper";

interface IUseAlarm {
  alarms: IAlarm[];
  isLast: boolean;
  getAlarms: (type: IStoreGetType, uid: string) => Promise<void>;
}

const LIMIT = 20;

let lastVisible: QueryDocumentSnapshot<DocumentData>;

function getQueryByType(type: IStoreGetType, uid: string): Query<DocumentData> {
  if (type === "init")
    return query(
      collection(db, "alarms"),
      where("targetUid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(LIMIT)
    );
  if (type === "load")
    return query(
      collection(db, "alarms"),
      where("targetUid", "==", uid),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(LIMIT)
    );
  return query(
    collection(db, "alarms"),
    where("targetUid", "==", uid),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

export const useAlarm = create<IUseAlarm>()(
  devtools((set, get) => ({
    alarms: [],
    isLast: false,
    getAlarms: async (type: IStoreGetType, uid: string) => {
      const res = await wrapPromise(async () => {
        const q = getQueryByType(type, uid);
        let [snap, res] = await getAlarmsByQuery(q);
        const isLast = res.length < LIMIT ? true : false;
        const alarms = combinePrevAndNewData(get().alarms, res, type);
        const newLastVisible = setCursorByType(snap, type);
        if (newLastVisible) lastVisible = newLastVisible;
        return { alarms, isLast };
      }, 1000);
      set((state: IUseAlarm) => {
        return {
          ...state,
          alarms: res.alarms,
          isLast: res.isLast,
        };
      });
    },
  }))
);
