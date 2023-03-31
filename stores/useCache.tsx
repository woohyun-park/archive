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
} from "../apis/firebase/fbRead";
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
} from "../apis/firebase/fbDef";
import { convertCreatedAt } from "../apis/firebase/fb";
import { IDict, IComment } from "../apis/def";
import { getTagsQuery } from "../apis/firebase/fbQueryTags";
import { getUsersQuery } from "../apis/firebase/fbQueryUsers";
import { getScrapsQuery } from "../apis/firebase/fbQueryScraps";
import { getAlarmsQuery } from "../apis/firebase/fbQueryAlarms";
import { getCommentsQuery } from "../apis/firebase/fbQueryComments";
import { getPostsQuery } from "../apis/firebase/fbQueryPosts";

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
  deleteCachedPost: (pathname: string, as: string, pid: string) => void;
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
    deleteCachedPost: (pathname: string, as: string, pid: string) => {
      set((state: IUseCache) => {
        const newState = { ...state };
        newState.caches[pathname][as].data = newState.caches[pathname][
          as
        ].data.filter((e) => e.id !== pid);
        return newState;
      });
    },
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
    const tQuery = query as IFetchQueryPosts;
    snap = await getDocs(
      getPostsQuery(fetchType, tQuery, fetchLimit, cache?.lastVisible)
    );
    if (tQuery.type !== "uidAndScrap") {
      if (tQuery.readType === "simple") {
        for (const doc of snap.docs) {
          data.push(doc.data());
        }
      } else {
        data = await readPosts(snap.docs);
      }
    } else {
      for await (const doc of snap.docs) {
        if (tQuery.readType === "simple") {
          data.push(doc.data());
        } else {
          const post = await readPost(doc.data().pid);
          data.push(post);
        }
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
