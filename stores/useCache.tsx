import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";
import {
  fetchAlarmsHelper,
  fetchPostsHelper,
  fetchScrapsHelper,
  fetchTagsHelper,
  fetchUsersHelper,
  getNewState,
  ICache,
} from "./useCacheHelper";
import {
  FETCH_LIMIT,
  IFetchQueryAlarms,
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

type IPage = IDict<ICache>;

export interface IUseCache {
  caches: IDict<IPage>;
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
}

export const useCache = create<IUseCache>()(
  devtools((set, get) => ({
    caches: {},
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
      const cache = await fetchPostsHelper(
        type,
        FETCH_LIMIT.post[numCols],
        getPostsQuery(
          type,
          query,
          FETCH_LIMIT.post[numCols],
          prevCache?.lastVisible
        ),
        prevCache
      );
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
  }))
);
