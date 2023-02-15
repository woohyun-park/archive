import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getAlarmsByQuery } from "../apis/firebase";
import { IAlarm } from "../libs/custom";
import { FETCH_LIMIT, getAlarmQuery, IFetchType } from "../libs/queryLib";
import { combineData, setCursor, wrapPromise } from "./libStores";

interface IUseAlarm {
  alarms: IAlarm[];
  isLast: boolean;
  getAlarms: (type: IFetchType, uid: string) => Promise<void>;
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;

export const useAlarm = create<IUseAlarm>()(
  devtools((set, get) => ({
    alarms: [],
    isLast: false,
    getAlarms: async (type: IFetchType, uid: string) => {
      const res = await wrapPromise(async () => {
        const q = getAlarmQuery(type, lastVisible, uid);
        let [snap, res] = await getAlarmsByQuery(q);
        const isLast = res.length < FETCH_LIMIT.alarm ? true : false;
        const alarms = combineData(get().alarms, res, type);
        const newLastVisible = setCursor(snap, type);
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
