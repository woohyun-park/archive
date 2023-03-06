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
import { useCache } from "../stores/useCache";
import { ICacheType } from "../stores/useCacheHelper";
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
  if (type === "post") {
    data = cache ? (cache.data as IPost[]) : [];
    typedQuery = query as IFetchQueryPost;
  } else if (type === "posts") {
    data = cache ? (cache.data as IPost[]) : [];
    typedQuery = query as IFetchQueryPosts;
  } else if (type === "comments") {
    data = cache ? (cache.data as IComment[]) : [];
    typedQuery = query as IFetchQueryComments;
  } else if (type === "tags") {
    data = cache ? (cache.data as ITag[]) : [];
    typedQuery = query as IFetchQueryTags;
  } else if (type === "users") {
    data = cache ? (cache.data as IUser[]) : [];
    typedQuery = query as IFetchQueryUsers;
  } else if (type === "scraps") {
    data = cache ? (cache.data as IScrap[]) : [];
    typedQuery = query as IFetchQueryScraps;
  } /* type === "alarms" */ else {
    data = cache ? (cache.data as IAlarm[]) : [];
    typedQuery = query as IFetchQueryAlarms;
  }

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener: data,
  });

  function onIntersect() {
    option?.numCols
      ? fetchCache(type, "load", typedQuery, path, as, option?.numCols)
      : fetchCache(type, "load", typedQuery, path, as);
  }
  function onChange() {}
  async function onRefresh() {
    option?.numCols
      ? fetchCache(type, "refresh", typedQuery, path, as, option?.numCols)
      : fetchCache(type, "refresh", typedQuery, path, as);
  }

  useEffect(() => {
    async function init() {
      // refresh가 불가능하다면 매번 새롭게 데이터를 init한다.
      // refresh가 가능하다면 저장된 데이터가 없는 경우에만 init한다
      if (!isPullable) {
        option?.numCols
          ? fetchCache(type, "init", typedQuery, path, as, option?.numCols)
          : fetchCache(type, "init", typedQuery, path, as);
      } else {
        if (data.length === 0) {
          option?.numCols
            ? fetchCache(type, "init", typedQuery, path, as, option?.numCols)
            : fetchCache(type, "init", typedQuery, path, as);
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
