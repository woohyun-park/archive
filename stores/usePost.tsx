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
import { db } from "../apis/firebase";
import { IComment, IDict } from "../libs/custom";
import { combinePrevAndNewData, setCursorByType } from "./useFeedHelper";

interface IPostStore {
  comments: IDict<IComment[]>;
  getComments: (type: IGetType, pid: string) => Promise<void>;
}

type IGetType = "init" | "load" | "refresh";

const LIMIT = 16;

let lastVisible: QueryDocumentSnapshot<DocumentData>;

function getQueryByType(type: IGetType, pid: string): Query<DocumentData> {
  if (type === "init")
    return query(
      collection(db, "comments"),
      where("pid", "==", pid),
      orderBy("createdAt", "desc"),
      limit(LIMIT)
    );
  if (type === "load")
    return query(
      collection(db, "comments"),
      where("pid", "==", pid),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(LIMIT)
    );
  return query(
    collection(db, "comments"),
    where("pid", "==", pid),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

async function getCommentsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IComment[]]> {
  const snap = await getDocs(q);
  const comments: IComment[] = [];
  for (const doc of snap.docs) {
    const comment: IDict<any> = doc.data();
    comment.createdAt = comment.createdAt.toDate();
    comments.push(comment as IComment);
  }
  return [snap, comments];
}

export const usePost = create<IPostStore>()(
  devtools((set, get) => ({
    comments: {},
    getComments: async (type: IGetType, pid: string) => {
      let comments: IComment[] = [];
      await Promise.all([
        (async () => {
          const q = getQueryByType(type, pid);
          let [snap, comments] = await getCommentsByQuery(q);
          comments = combinePrevAndNewData(get().comments[pid], comments, type);
          const newLastVisible = setCursorByType(snap, type);
          if (newLastVisible) lastVisible = newLastVisible;
          return comments;
        })(),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((values) => {
        comments = values[0];
      });
      set((state: IPostStore) => {
        state.comments[pid] = comments;
        return {
          ...state,
        };
      });
    },
  }))
);
