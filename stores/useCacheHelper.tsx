import {
  DocumentData,
  getDocs,
  Query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { combineData, setCursor } from "./libStores";
import { readAlarms, readScraps, readUsers } from "../apis/fbRead";
import { IUseCache } from "./useCache";
import { IFetchType } from "../apis/fbDef";
import { convertCreatedAt } from "../apis/firebase";
import { IComment } from "../libs/custom";

export type ICacheType = "posts" | "tags" | "scraps" | "alarms" | "test";

export interface ICache {
  data: any[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined;
}

export function getNewState(
  key: string,
  state: IUseCache,
  cache: ICache,
  pathname: string
) {
  const newState = { ...state };
  if (!newState.caches[pathname]) newState.caches[pathname] = { [key]: cache };
  else newState.caches[pathname][key] = cache;
  return newState;
}

export async function fetchHelper(
  dataType: "tags" | "users" | "scraps" | "alarms" | "comments",
  fetchType: IFetchType,
  fetchLimit: number,
  query: Query<DocumentData>,
  cache: ICache | undefined
) {
  const snap = await getDocs(query);
  let data: any[] = [];
  if (dataType === "tags") {
    data = [];
    snap.forEach((doc) => data.push(doc.data()));
  } else if (dataType === "users") {
    data = await readUsers(snap.docs);
  } else if (dataType === "scraps") {
    data = await readScraps(snap.docs);
  } else if (dataType === "alarms") {
    data = await readAlarms(snap.docs);
  } else if (dataType === "comments") {
    snap.forEach((doc) => {
      data.push({
        ...doc.data(),
        createdAt: convertCreatedAt(doc.data().createdAt),
      } as IComment);
    });
  }
  const newLastVisible = setCursor(snap, fetchType);
  if (!newLastVisible)
    return {
      data: [],
      isLast: true,
      lastVisible: undefined,
    };
  if (cache) {
    cache.data = combineData(cache.data, data, fetchType);
    cache.isLast = data.length < fetchLimit ? true : false;
    if (newLastVisible) cache.lastVisible = newLastVisible;
  } else {
    cache = {
      data: combineData([], data, fetchType),
      isLast: data.length < fetchLimit ? true : false,
      lastVisible: newLastVisible,
    };
  }
  return cache;
}
