import {
  DocumentData,
  getDocs,
  Query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  getAlarmQuery,
  getScrapsQuery,
  getTagsQuery,
  getUsersByKeywordQuery,
} from "../apis/fbQuery";
import { combineData, setCursor } from "./libStores";
import { readAlarms, readPosts, readScraps, readUsers } from "../apis/fbRead";
import { FETCH_LIMIT, IFetchType, IUseCache } from "./useCache";

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
    throw console.error("Cannot fetch the following posts:", fetchType, query);
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

// export async function fetchTagsHelper(
//   fetchType: IFetchType,
//   cache: ICache,
//   keyword: string
// ) {
//   const q = getTagsQuery(fetchType, keyword, cache.lastVisible);
// const snap = await getDocs(q);
// const resTags: any[] = [];
// snap.forEach((doc) => resTags.push(doc.data()));
//   cache.data = combineData(cache.data, resTags, fetchType);
//   cache.isLast = resTags.length < FETCH_LIMIT.tag ? true : false;
//   const newLastVisible = setCursor(snap, fetchType);
//   if (newLastVisible) cache.lastVisible = newLastVisible;
//   return cache;
// }

export async function fetchUsersByKeywordHelper(
  fetchType: IFetchType,
  cache: ICache,
  keyword: string
) {
  const snap = await getDocs(
    getUsersByKeywordQuery(fetchType, keyword, cache.lastVisible)
  );
  const resUsers = await readUsers(snap.docs);
  cache.data = combineData(cache.data, resUsers, fetchType);
  cache.isLast = resUsers.length < FETCH_LIMIT.user ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

export async function fetchScrapsHelper(
  fetchType: IFetchType,
  cache: ICache,
  uid: string
) {
  const q = getScrapsQuery(fetchType, uid, cache.lastVisible);
  const snap = await getDocs(q);
  const resScraps = await readScraps(snap.docs);
  cache.data = combineData(cache.data, resScraps, fetchType);
  cache.isLast = resScraps.length < FETCH_LIMIT.tag ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}

export async function fetchAlarmsHelper(
  fetchType: IFetchType,
  cache: ICache,
  uid: string
) {
  const snap = await getDocs(getAlarmQuery(fetchType, uid, cache.lastVisible));
  const resAlarms = await readAlarms(snap.docs);
  cache.data = combineData(cache.data, resAlarms, fetchType);
  cache.isLast = resAlarms.length < FETCH_LIMIT.alarm ? true : false;
  const newLastVisible = setCursor(snap, fetchType);
  if (newLastVisible) cache.lastVisible = newLastVisible;
  return cache;
}
