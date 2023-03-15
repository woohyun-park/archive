import create from "zustand";
import { devtools } from "zustand/middleware";
import { IAlarm, ILike, IScrap, IUser } from "../libs/custom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../apis/firebase";
import { readAlarm, readAlarms, readDatasByQuery } from "../apis/fbRead";

interface IState {
  curUser: IUser;
  hasNewAlarms: boolean;
  getCurUser: (id: string) => Promise<IUser>;
}

export const useUser = create<IState>()(
  devtools((set, get) => ({
    curUser: {
      id: "",
      email: "",
      displayName: "",
      photoURL:
        "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
      txt: "",
      followers: [],
      followings: [],
      createdAt: new Date(),
    },
    hasNewAlarms: false,
    getCurUser: async (id: string) => {
      const user = await getDoc(doc(db, "users", id));
      const docAlarms = await getDocs(
        query(
          collection(db, "alarms"),
          where("targetUid", "==", id),
          orderBy("createdAt", "desc")
        )
      );
      const alarms = await readAlarms(docAlarms.docs);
      const curUser = {
        ...(user.data() as IUser),
        alarms,
      };
      const unsubscribeUser = onSnapshot(doc(db, "users", id), (doc) => {
        set((state: IState) => {
          return {
            ...state,
            curUser: {
              ...curUser,
              likes: state.curUser.likes,
              scraps: state.curUser.scraps,
              alarms: state.curUser.alarms,
            },
          };
        });
      });
      const unsubscribeLikes = onSnapshot(
        query(collection(db, "likes"), where("uid", "==", id)),
        (snap) => {
          const datas: ILike[] = [];
          snap.forEach((doc) => {
            datas.push({ ...(doc.data() as ILike) });
          });
          set((state: IState) => {
            return {
              ...state,
              curUser: { ...state.curUser, likes: datas },
            };
          });
        }
      );
      const unsubscribeScraps = onSnapshot(
        query(collection(db, "scraps"), where("uid", "==", id)),
        (snap) => {
          const datas: IScrap[] = [];
          snap.forEach((doc) => {
            datas.push({ ...(doc.data() as IScrap) });
          });
          set((state: IState) => {
            return {
              ...state,
              curUser: { ...state.curUser, scraps: datas },
            };
          });
        }
      );
      const unsubscribeAlarms = onSnapshot(
        query(
          collection(db, "alarms"),
          where("targetUid", "==", id),
          orderBy("createdAt", "desc")
        ),
        async (snap) => {
          const prevAlarms = get().curUser.alarms;
          const alarms: IAlarm[] = [];
          for await (const doc of snap.docs) {
            const alarm = prevAlarms?.find((alarm) => alarm.id === doc.id);
            if (alarm) {
              alarm.isViewed = (doc.data() as IAlarm).isViewed;
              alarms.push(alarm);
            } else {
              const newAlarm = await readAlarm(doc.id);
              alarms.push(newAlarm);
            }
          }
          const hasNewAlarms =
            alarms.filter((alarm) => !alarm.isViewed).length === 0
              ? false
              : true;
          set((state: IState) => {
            return {
              ...state,
              curUser: { ...state.curUser, alarms },
              hasNewAlarms,
            };
          });
        }
      );
      set((state: IState) => {
        return {
          ...state,
          curUser,
        };
      });
      return curUser;
    },
  }))
);
