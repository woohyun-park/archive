import { useRouter } from "next/router";
import { useEffect } from "react";
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
import { useInfiniteScroll } from "./useInfiniteScroll";

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
  const isLast = cache ? cache.isLast : false;

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

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener: data,
  });

  function onIntersect() {
    fetchCache(type, "load", typedQuery, path, as, numCols);
  }
  function onChange() {}
  async function onRefresh() {
    fetchCache(type, "refresh", typedQuery, path, as, numCols);
  }

  useEffect(() => {
    async function init() {
      // refresh가 불가능하다면 매번 새롭게 데이터를 init한다.
      // refresh가 가능하다면 저장된 데이터가 없는 경우에만 init한다
      if (!isPullable) {
        fetchCache(type, "init", typedQuery, path, as, numCols);
      } else {
        if (data.length === 0) {
          fetchCache(type, "init", typedQuery, path, as, numCols);
        }
      }
    }
    init();
  }, []);

  return {
    data,
    isLast,
    onRefresh,
    setLastIntersecting,
    loading,
  };
};
