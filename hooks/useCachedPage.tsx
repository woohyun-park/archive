import { useRouter } from "next/router";
import { IAlarm, IPost, ITag, IUser } from "../libs/custom";
import { useCache } from "../stores/useCache";

export const useCachedPage = (
  type:
    | "posts"
    | "postsByTag"
    | "postsByKeyword"
    | "alarms"
    | "usersByKeyword"
    | "tags"
) => {
  const router = useRouter();
  const {
    caches,
    fetchPosts,
    fetchPostsByTag,
    fetchPostsByKeyword,
    fetchAlarms,
    fetchUsersByKeyword,
    fetchTags,
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
  } else if (type === "usersByKeyword") {
    const data = cache ? (cache.data as IUser[]) : [];
    return { data, isLast, fetchUsersByKeyword };
  } else if (type === "tags") {
    const data = cache ? (cache.data as ITag[]) : [];
    return { data, isLast, fetchTags };
  } else {
    //type == "alarms"
    const data = cache ? (cache.data as IAlarm[]) : [];
    return { data, isLast, fetchAlarms };
  }
};
