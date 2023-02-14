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
  isLasts: IDict<boolean>;
  getComments: (type: IGetType, pid: string) => Promise<void>;
  setComments: (comments: IComment[], pid: string) => void;
  setIsLasts: (pid: string) => void;
}

type IGetType = "init" | "load" | "refresh";

const LIMIT = 16;

const lastVisible: IDict<QueryDocumentSnapshot<DocumentData>> = {};

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
      startAfter(lastVisible[pid]),
      limit(LIMIT)
    );
  return query(
    collection(db, "comments"),
    where("pid", "==", pid),
    orderBy("createdAt", "desc"),
    endAt(lastVisible[pid])
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
    isLasts: {},
    getComments: async (type: IGetType, pid: string) => {
      let comments: IComment[], isLast: boolean;
      await Promise.all([
        (async () => {
          const q = getQueryByType(type, pid);
          const [snap, res] = await getCommentsByQuery(q);
          const isLast = res.length < LIMIT ? true : false;
          const comments = combinePrevAndNewData(
            get().comments[pid],
            res,
            type
          );
          const newLastVisible = setCursorByType(snap, type);
          if (newLastVisible) lastVisible[pid] = newLastVisible;
          return { comments, isLast };
        })(),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((res) => {
        comments = res[0].comments;
        isLast = res[0].isLast;
      });
      set((state: IPostStore) => {
        state.comments[pid] = comments;
        state.isLasts[pid] = isLast;
        return {
          ...state,
        };
      });
    },
    setComments: (comments: IComment[], pid: string) => {
      set((state: IPostStore) => {
        state.comments[pid] = comments;
        return {
          ...state,
        };
      });
    },
    setIsLasts: (pid: string) => {
      set((state: IPostStore) => {
        state.isLasts[pid] = true;
        return { ...state };
      });
    },
  }))
);
