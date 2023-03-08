import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { combineData, setCursor } from "./libStores";
import {
  readAlarms,
  readPost,
  readPosts,
  readScraps,
  readUsers,
} from "../apis/fbRead";
import {
  FETCH_LIMIT,
  IFetchQueryPosts,
  IFetchType,
  IFetchQuery,
  IFetchQueryAlarms,
  IFetchQueryComments,
  IFetchQueryScraps,
  IFetchQueryTags,
  IFetchQueryUsers,
} from "../apis/fbDef";
import { convertCreatedAt } from "../apis/firebase";
import { IDict, IComment } from "../libs/custom";
import { getTagsQuery } from "../apis/fbQueryTags";
import { getUsersQuery } from "../apis/fbQueryUsers";
import { getScrapsQuery } from "../apis/fbQueryScraps";
import { getAlarmsQuery } from "../apis/fbQueryAlarms";
import { getCommentsQuery } from "../apis/fbQueryComments";
import { getPostsQuery } from "../apis/fbQueryPosts";

export type ICacheType =
  | "post"
  | "posts"
  | "tags"
  | "scraps"
  | "alarms"
  | "users"
  | "comments";

export interface ICache {
  data: any[];
  isLast: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined;
}

type IPage = IDict<ICache>;

export interface IUseCache {
  caches: IDict<IPage>;
  fetchCache: (
    cacheType: ICacheType,
    fetchType: IFetchType,
    query: IFetchQueryPosts,
    pathname: string,
    as: string,
    numCols?: number
  ) => Promise<void>;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
    fetchCache: async (
      cacheType: ICacheType,
      fetchType: IFetchType,
      query: IFetchQueryPosts,
      pathname: string,
      as: string,
      numCols?: number
    ) => {
      if (!numCols) numCols = 1;
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      const cache = await fetchHelper(
        cacheType,
        fetchType,
        cacheType === "posts"
          ? FETCH_LIMIT.posts[numCols]
          : FETCH_LIMIT[cacheType],
        query,
        prevCache
      );
      set((state: IUseCache) =>
        getNewState(as || cacheType, state, cache, pathname)
      );
    },
  }))
);

async function fetchHelper(
  cacheType: ICacheType,
  fetchType: IFetchType,
  fetchLimit: number,
  query: IFetchQuery,
  cache: ICache | undefined
) {
  console.log("fetchHelper!", cacheType, fetchType, fetchLimit, query, cache);

  let snap;
  let data: any[] = [];

  if (cacheType === "tags") {
    snap = await getDocs(
      getTagsQuery(
        fetchType,
        query as IFetchQueryTags,
        fetchLimit,
        cache?.lastVisible
      )
    );
    data = [];
    snap.forEach((doc) => data.push(doc.data()));
  } else if (cacheType === "users") {
    snap = await getDocs(
      getUsersQuery(
        fetchType,
        query as IFetchQueryUsers,
        fetchLimit,
        cache?.lastVisible
      )
    );
    data = await readUsers(snap.docs);
  } else if (cacheType === "scraps") {
    snap = await getDocs(
      getScrapsQuery(
        fetchType,
        query as IFetchQueryScraps,
        fetchLimit,
        cache?.lastVisible
      )
    );
    data = await readScraps(snap.docs);
  } else if (cacheType === "alarms") {
    snap = await getDocs(
      getAlarmsQuery(
        fetchType,
        query as IFetchQueryAlarms,
        fetchLimit,
        cache?.lastVisible
      )
    );
    data = await readAlarms(snap.docs);
  } else if (cacheType === "comments") {
    snap = await getDocs(getCommentsQuery(query as IFetchQueryComments));
    snap.forEach((doc) => {
      data.push({
        ...doc.data(),
        createdAt: convertCreatedAt(doc.data().createdAt),
      } as IComment);
    });
  } else if (cacheType === "posts") {
    snap = await getDocs(
      getPostsQuery(
        fetchType,
        query as IFetchQueryPosts,
        fetchLimit,
        cache?.lastVisible
      )
    );
    if (query.type !== "uidAndScrap") {
      data = await readPosts(snap.docs);
    } else {
      const resScraps = await readScraps(snap.docs);
      data = [];
      for await (const res of resScraps) {
        const post = await readPost(res.pid);
        data.push(post);
      }
    }
  } else if (cacheType === "post") {
    const pid = query.value.pid;
    const newPost = await readPost(pid);
    return { data: [newPost], isLast: true, lastVisible: undefined };
  }
  const newLastVisible = setCursor(
    snap as QuerySnapshot<DocumentData>,
    fetchType
  );
  if (!newLastVisible)
    return {
      data: cache?.data || [],
      isLast: true,
      lastVisible: undefined,
    };
  console.log(cache);
  if (cache) {
    cache.data = combineData(cache.data, data, fetchType);
    console.log(data, data.length, fetchLimit);
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

function getNewState(
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
