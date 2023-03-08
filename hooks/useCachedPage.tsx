import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  IFetchQuery,
  IFetchQueryAlarms,
  IFetchQueryComments,
  IFetchQueryPost,
  IFetchQueryPosts,
  IFetchQueryScraps,
  IFetchQueryTags,
  IFetchQueryUsers,
} from "../apis/fbDef";
import { IAlarm, IComment, IPost, IScrap, ITag, IUser } from "../libs/custom";
import { ICacheType, useCache } from "../stores/useCache";

// page를 cache하는데 필요한 함수 및 변수들을 한꺼번에 가져올 수 있도록 도와주는 훅

// type: 가져오고자 하는 데이터 (e.g. posts, users)
// query: 데이터를 가져올 때 쿼리에 사용될 값들 (e.g. {uid, keyword})
// option: 그 이외 자잘한 옵션들

export const useCachedPage = (
  type: ICacheType,
  query: IFetchQuery,
  option?: { as?: string; numCols?: number; isPullable?: boolean }
) => {
  const router = useRouter();
  const { caches, fetchCache } = useCache();

  const as = option?.as ? option?.as : type;
  const numCols = option?.numCols ? option?.numCols : 1;
  const isPullable = option?.isPullable ? option?.isPullable : true;

  const path = router.asPath;
  const page = caches[path];
  const cache = page && page[as];
  const canFetchMore = cache ? !cache.isLast : false;

  // type에 따라서 dat와 query의 type을 정의
  let data, typedQuery: any;
  switch (type) {
    case "post":
      data = cache ? (cache.data as IPost[]) : [];
      typedQuery = query as IFetchQueryPost;
      break;
    case "posts":
      data = cache ? (cache.data as IPost[]) : [];
      typedQuery = query as IFetchQueryPosts;
      break;
    case "comments":
      data = cache ? (cache.data as IComment[]) : [];
      typedQuery = query as IFetchQueryComments;
      break;
    case "tags":
      data = cache ? (cache.data as ITag[]) : [];
      typedQuery = query as IFetchQueryTags;
      break;
    case "users":
      data = cache ? (cache.data as IUser[]) : [];
      typedQuery = query as IFetchQueryUsers;
      break;
    case "scraps":
      data = cache ? (cache.data as IScrap[]) : [];
      typedQuery = query as IFetchQueryScraps;
      break;
    case "alarms":
      data = cache ? (cache.data as IAlarm[]) : [];
      typedQuery = query as IFetchQueryAlarms;
      break;
    default:
      break;
  }

  async function onInit() {
    await fetchCache(type, "init", typedQuery, path, as, numCols);
  }

  async function onFetchMore() {
    await fetchCache(type, "load", typedQuery, path, as, numCols);
  }
  async function onRefresh() {
    await fetchCache(type, "refresh", typedQuery, path, as, numCols);
  }

  useEffect(() => {
    async function init() {
      // refresh가 불가능하다면 매번 새롭게 데이터를 init한다.
      // refresh가 가능하다면 저장된 데이터가 없는 경우에만 init한다
      if (!isPullable) {
        onInit();
      } else {
        if (router.query.refresh) {
          onRefresh();
        } else if (data.length === 0) {
          onInit();
        }
      }
    }
    init();
  }, []);

  return {
    data,
    canFetchMore,
    onRefresh,
    onFetchMore,
  };
};
