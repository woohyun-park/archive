import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict, IPost } from "../libs/custom";
import {
  fetchAlarmsHelper,
  fetchCommentsHelper,
  fetchScrapsHelper,
  fetchTagsHelper,
  fetchUsersHelper,
  getNewState,
  ICache,
} from "./useCacheHelper";
import {
  FETCH_LIMIT,
  IFetchQueryAlarms,
  IFetchQueryComments,
  IFetchQueryPost,
  IFetchQueryPosts,
  IFetchQueryTags,
  IFetchQueryUsers,
  IFetchType,
} from "../apis/fbDef";
import { getPostsQuery } from "../apis/fbQueryPosts";
import { getTagsQuery } from "../apis/fbQueryTags";
import { getUsersQuery } from "../apis/fbQueryUsers";
import { getAlarmsQuery } from "../apis/fbQueryAlarms";
import { getScrapsQuery } from "../apis/fbQueryScraps";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { readPost, readPosts, readScraps } from "../apis/fbRead";
import { combineData, setCursor } from "./libStores";
import { db } from "../apis/firebase";
import { async } from "@firebase/util";

type IPage = IDict<ICache>;

export interface IUseCache {
  caches: IDict<IPage>;
  fetchPost: (query: IFetchQueryPost, pathname: string) => Promise<void>;
  fetchPosts: (
    type: IFetchType,
    query: IFetchQueryPosts,
    pathname: string,
    as: string,
    numCols: number
  ) => Promise<void>;
  fetchTags: (
    type: IFetchType,
    query: IFetchQueryTags,
    pathname: string,
    as: string
  ) => Promise<void>;
  fetchUsers: (
    type: IFetchType,
    query: IFetchQueryUsers,
    pathname: string,
    as: string
  ) => Promise<void>;
  fetchAlarms: (
    type: IFetchType,
    query: IFetchQueryAlarms,
    pathname: string
  ) => Promise<void>;
  fetchScraps: (
    type: IFetchType,
    query: IFetchQueryAlarms,
    pathname: string
  ) => Promise<void>;
  fetchComments: (
    type: IFetchType,
    query: IFetchQueryComments,
    pathname: string
  ) => Promise<void>;
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
    fetchPost: async (query, pathname) => {
      const pid = query.value.pid;
      const newPost = await readPost(pid);
      const newCache: ICache = {
        data: [newPost],
        isLast: true,
        lastVisible: undefined,
      };
      set((state: IUseCache) => getNewState("post", state, newCache, pathname));
    },
    fetchPosts: async (
      type: IFetchType,
      query: IFetchQueryPosts,
      pathname: string,
      as: string,
      numCols: number
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      let resPosts: IPost[];
      let newLastVisible: QueryDocumentSnapshot<DocumentData> | null;
      const q = getPostsQuery(
        type,
        query,
        FETCH_LIMIT.post[numCols],
        prevCache?.lastVisible
      );
      if (query.type !== "uidAndScrap") {
        const snap = await getDocs(q);
        resPosts = await readPosts(snap.docs);
        newLastVisible = setCursor(snap, type);
      } else {
        const snapScrap = await getDocs(q);
        const resScraps = await readScraps(snapScrap.docs);
        resPosts = [];
        for await (const res of resScraps) {
          const post = await readPost(res.pid);
          resPosts.push(post);
        }
        newLastVisible = setCursor(snapScrap, type);
      }
      if (!newLastVisible)
        throw console.error("Cannot fetch the following posts:", type, query);
      let cache: ICache;
      if (prevCache) {
        cache = prevCache;
        cache.data = combineData(cache.data, resPosts, type);
        cache.isLast =
          resPosts.length < FETCH_LIMIT.post[numCols] ? true : false;
        if (newLastVisible) cache.lastVisible = newLastVisible;
      } else {
        cache = {
          data: combineData([], resPosts, type),
          isLast: resPosts.length < FETCH_LIMIT.post[numCols] ? true : false,
          lastVisible: newLastVisible,
        };
      }
      set((state: IUseCache) => getNewState(as, state, cache, pathname));
    },
    fetchTags: async (
      type: IFetchType,
      query: IFetchQueryTags,
      pathname: string,
      as: string
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      const cache = await fetchTagsHelper(
        type,
        FETCH_LIMIT.tag,
        getTagsQuery(type, query, FETCH_LIMIT.tag, prevCache?.lastVisible),
        prevCache
      );
      set((state: IUseCache) => getNewState(as, state, cache, pathname));
    },
    fetchUsers: async (
      type: IFetchType,
      query: IFetchQueryUsers,
      pathname: string,
      as: string
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname][as]
        : undefined;
      const cache = await fetchUsersHelper(
        type,
        FETCH_LIMIT.user,
        getUsersQuery(type, query, FETCH_LIMIT.tag, prevCache?.lastVisible),
        prevCache
      );
      set((state: IUseCache) => getNewState(as, state, cache, pathname));
    },
    fetchAlarms: async (
      type: IFetchType,
      query: IFetchQueryAlarms,
      pathname: string
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname]["alarms"]
        : undefined;
      const cache = await fetchAlarmsHelper(
        type,
        FETCH_LIMIT.alarm,
        getAlarmsQuery(type, query, FETCH_LIMIT.alarm, prevCache?.lastVisible),
        prevCache
      );
      set((state: IUseCache) => getNewState("alarms", state, cache, pathname));
    },
    fetchScraps: async (
      type: IFetchType,
      query: IFetchQueryAlarms,
      pathname: string
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname]["scraps"]
        : undefined;
      const cache = await fetchScrapsHelper(
        type,
        FETCH_LIMIT.scrap,
        getScrapsQuery(type, query, FETCH_LIMIT.scrap, prevCache?.lastVisible),
        prevCache
      );
      set((state: IUseCache) => getNewState("scraps", state, cache, pathname));
    },
    fetchComments: async (
      type: IFetchType,
      fetchQuery: IFetchQueryComments,
      pathname: string
    ) => {
      const prevCache = get().caches[pathname]
        ? get().caches[pathname]["scraps"]
        : undefined;
      const cache = await fetchCommentsHelper(
        type,
        FETCH_LIMIT.comment,
        query(
          collection(db, "comments"),
          where("pid", "==", fetchQuery.value.pid)
        ),
        prevCache
      );
      set((state: IUseCache) =>
        getNewState("comments", state, cache, pathname)
      );
    },
  }))
);
