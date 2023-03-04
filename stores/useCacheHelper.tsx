import {
  DocumentData,
  getDocs,
  Query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { combineData, setCursor } from "./libStores";
import { readAlarms, readPosts, readScraps, readUsers } from "../apis/fbRead";
import { IUseCache } from "./useCache";
import { FETCH_LIMIT, IFetchType } from "../apis/fbDef";
import { getScrapsQuery } from "../apis/fbQueryScraps";

export type ICacheType = "posts" | "tags" | "scraps" | "alarms" | "test";

export interface ICache {
  data: any[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData>;
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

export async function fetchPostsHelper(
  fetchType: IFetchType,
  fetchLimit: number,
  query: Query<DocumentData>,
  cache: ICache | undefined
) {
  console.log("fetchPostsHelper", fetchType, fetchLimit, query, cache);
  const snap = await getDocs(query);
  const resPosts = await readPosts(snap.docs);
  const newLastVisible = setCursor(snap, fetchType);
  if (!newLastVisible)
    throw console.error("Cannot fetch the following posts:", fetchType, query);
  if (cache) {
    cache.data = combineData(cache.data, resPosts, fetchType);
    cache.isLast = resPosts.length < fetchLimit ? true : false;
    if (newLastVisible) cache.lastVisible = newLastVisible;
  } else {
    cache = {
      data: combineData([], resPosts, fetchType),
      isLast: resPosts.length < fetchLimit ? true : false,
      lastVisible: newLastVisible,
    };
  }
  return cache;
}
export async function fetchTagsHelper(
  fetchType: IFetchType,
  fetchLimit: number,
  query: Query<DocumentData>,
  cache: ICache | undefined
) {
  const snap = await getDocs(query);
  const resTags: any[] = [];
  snap.forEach((doc) => resTags.push(doc.data()));
  const newLastVisible = setCursor(snap, fetchType);
  if (!newLastVisible)
    throw console.error("Cannot fetch the following tags:", fetchType, query);
  if (cache) {
    cache.data = combineData(cache.data, resTags, fetchType);
    cache.isLast = resTags.length < fetchLimit ? true : false;
    if (newLastVisible) cache.lastVisible = newLastVisible;
  } else {
    cache = {
      data: combineData([], resTags, fetchType),
      isLast: resTags.length < fetchLimit ? true : false,
      lastVisible: newLastVisible,
    };
  }
  return cache;
}
export async function fetchUsersHelper(
  fetchType: IFetchType,
  fetchLimit: number,
  query: Query<DocumentData>,
  cache: ICache | undefined
) {
  const snap = await getDocs(query);
  const resUsers = await readUsers(snap.docs);
  const newLastVisible = setCursor(snap, fetchType);
  if (!newLastVisible)
    throw console.error("Cannot fetch the following users:", fetchType, query);
  if (cache) {
    cache.data = combineData(cache.data, resUsers, fetchType);
    cache.isLast = resUsers.length < fetchLimit ? true : false;
    if (newLastVisible) cache.lastVisible = newLastVisible;
  } else {
    cache = {
      data: combineData([], resUsers, fetchType),
      isLast: resUsers.length < fetchLimit ? true : false,
      lastVisible: newLastVisible,
    };
  }
  return cache;
}

export async function fetchScrapsHelper(
  fetchType: IFetchType,
  fetchLimit: number,
  query: Query<DocumentData>,
  cache: ICache | undefined
) {
  const snap = await getDocs(query);
  const resScraps = await readScraps(snap.docs);
  const newLastVisible = setCursor(snap, fetchType);
  if (!newLastVisible)
    throw console.error("Cannot fetch the following scraps:", fetchType, query);
  if (cache) {
    cache.data = combineData(cache.data, resScraps, fetchType);
    cache.isLast = resScraps.length < fetchLimit ? true : false;
    if (newLastVisible) cache.lastVisible = newLastVisible;
  } else {
    cache = {
      data: combineData([], resScraps, fetchType),
      isLast: resScraps.length < fetchLimit ? true : false,
      lastVisible: newLastVisible,
    };
  }
  return cache;
}

export async function fetchAlarmsHelper(
  fetchType: IFetchType,
  fetchLimit: number,
  query: Query<DocumentData>,
  cache: ICache | undefined
) {
  const snap = await getDocs(query);
  const resAlarms = await readAlarms(snap.docs);
  const newLastVisible = setCursor(snap, fetchType);
  if (!newLastVisible)
    throw console.error("Cannot fetch the following alarms:", fetchType, query);
  if (cache) {
    cache.data = combineData(cache.data, resAlarms, fetchType);
    cache.isLast = resAlarms.length < fetchLimit ? true : false;
    if (newLastVisible) cache.lastVisible = newLastVisible;
  } else {
    cache = {
      data: combineData([], resAlarms, fetchType),
      isLast: resAlarms.length < fetchLimit ? true : false,
      lastVisible: newLastVisible,
    };
  }
  return cache;
}
