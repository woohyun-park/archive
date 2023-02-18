import {
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { IAlarm } from "../libs/custom";
import { FETCH_LIMIT, getAlarmQuery, IFetchType } from "../apis/fbQuery";
import { combineData, setCursor, wrapPromise } from "./libStores";
import { readAlarm } from "../apis/fbRead";

interface IUseAlarm {
  alarms: IAlarm[];
  isLast: boolean;
  setAlarms: (alarms: IAlarm[]) => void;
  getAlarms: (type: IFetchType, uid: string) => Promise<void>;
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;

export const useAlarm = create<IUseAlarm>()(
  devtools((set, get) => ({
    alarms: [],
    isLast: false,
    setAlarms: (alarms: IAlarm[]) => {
      set((state: IUseAlarm) => {
        return {
          ...state,
          alarms,
        };
      });
    },
    getAlarms: async (type: IFetchType, uid: string) => {
      const res = await wrapPromise(async () => {
        const q = getAlarmQuery(type, lastVisible, uid);
        const snap = await getDocs(q);
        const resAlarms: IAlarm[] = [];
        for await (const doc of snap.docs) {
          const alarm = await readAlarm(doc.data().id);
          resAlarms.push(alarm);
        }
        const isLast = resAlarms.length < FETCH_LIMIT.alarm ? true : false;
        const alarms = combineData(get().alarms, resAlarms, type);
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
    // addAlarm: (alarm: IAlarm) => {
    //   set((state: IUseAlarm) => {
    //     return {
    //       ...state,
    //       alarms: [alarm, ...state.alarms],
    //     };
    //   });
    // },
    // deleteAlarm: (aid: string) => {
    //   set((state: IUseAlarm) => {
    //     return {
    //       alarms: [...state.alarms].filter((alarm) => alarm.id !== aid),
    //     };
    //   });
    // },
  }))
);
