import {
  collection,
  DocumentData,
  endAt,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { db, getData, getDatasByQuery } from "../apis/firebase";
import { IAlarm, IComment, IDict, IPost, ITag, IUser } from "../libs/custom";
import {
  combinePrevAndNewData,
  getPostsByQuery,
  setCursorByType,
} from "./useFeedHelper";

interface IUseAlarm {
  alarms: IAlarm[];
  getAlarms: (type: IAlarmGetType, uid: string) => Promise<void>;
}
type IAlarmGetType = "init" | "load" | "refresh";

const LIMIT = 20;

let lastVisible: QueryDocumentSnapshot<DocumentData>;

function getQueryByType(type: IAlarmGetType, uid: string): Query<DocumentData> {
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

async function getAlarmsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IAlarm[]]> {
  const res: IAlarm[] = await getDatasByQuery(q);
  const snap = await getDocs(q);
  const alarms: IAlarm[] = [];

  for await (const doc of snap.docs) {
    const alarm: IDict<any> = doc.data();
    if (alarm.type === "like") {
      const author = await getData<IUser>("users", alarm.uid);
      const post = await getData<IPost>("posts", alarm.targetPid || "");
      alarm.author = author;
      alarm.post = post;
    } else if (alarm.type === "comment") {
      const author = await getData<IUser>("users", alarm.uid);
      const comment = await getData<IComment>(
        "comments",
        alarm.targetCid || ""
      );
      const post = await getData<IPost>("posts", alarm.targetPid || "");
      alarm.author = author;
      alarm.post = post;
      alarm.comment = comment;
    } else if (alarm.type === "follow") {
      const author = await getData<IUser>("users", alarm.uid);
      alarm.author = author;
    }
    alarm.createdAt = alarm.createdAt.toDate();
    alarms.push(alarm as IAlarm);
  }
  return [snap, alarms];
}

export const useAlarm = create<IUseAlarm>()(
  devtools((set, get) => ({
    alarms: [],
    getAlarms: async (type: IAlarmGetType, uid: string) => {
      let alarms: IAlarm[] = [];
      await Promise.all([
        (async () => {
          const q = getQueryByType(type, uid);
          let [snap, alarms] = await getAlarmsByQuery(q);
          alarms = combinePrevAndNewData(get().alarms, alarms, type);
          const newLastVisible = setCursorByType(snap, type);
          if (newLastVisible) lastVisible = newLastVisible;
          return alarms;
        })(),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((values) => {
        alarms = values[0];
      });
      set((state: IUseAlarm) => {
        return {
          ...state,
          alarms,
        };
      });
    },
  }))
);
