import { useRouter } from "next/router";
import { IAlarm, IPost, IScrap, ITag, IUser } from "../libs/custom";
import { useCache } from "../stores/useCache";
import { ICacheType } from "../stores/useCacheHelper";

export const useCachedPage = (type: ICacheType) => {
  const router = useRouter();
  const {
    caches,
    fetchPosts,
    fetchPostsByTag,
    fetchPostsByKeyword,
    fetchPostsByUid,
    fetchUsersByKeyword,
    fetchTags,
    fetchScraps,
    fetchAlarms,
  } = useCache();

  const path = router.asPath;
  const page = caches[path];
  const cache = page && page[type];
  const isLast = cache ? cache.isLast : false;

  if (type === "posts") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { data, isLast, fetchPosts };
  } else if (type === "postsByTag") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { data, isLast, fetchPostsByTag };
  } else if (type === "postsByKeyword") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { data, isLast, fetchPostsByKeyword };
  } else if (type === "postsByUid") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { data, isLast, fetchPostsByUid };
  } else if (type === "usersByKeyword") {
    const data = cache ? (cache.data as IUser[]) : [];
    return { data, isLast, fetchUsersByKeyword };
  } else if (type === "tags") {
    const data = cache ? (cache.data as ITag[]) : [];
    return { data, isLast, fetchTags };
  } else if (type === "scraps") {
    const data = cache ? (cache.data as IScrap[]) : [];
    return { data, isLast, fetchScraps };
  } /* type === "alarms" */ else {
    const data = cache ? (cache.data as IAlarm[]) : [];
    return { data, isLast, fetchAlarms };
  }
};
