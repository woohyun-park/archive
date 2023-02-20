import { useRouter } from "next/router";
import { IFetchType } from "../apis/fbQuery";
import { IAlarm, IPost } from "../libs/custom";
import { useCache } from "../stores/useCache";

export const useCachedPage = (type: "posts" | "taggedPosts" | "alarms") => {
  const router = useRouter();
  const { caches, fetchPosts, fetchTaggedPosts, fetchAlarms } = useCache();

  const path = router.asPath;
  const page = caches[path];
  const cache = page && page[type];
  const isLast = cache ? cache.isLast : false;

  if (type === "posts") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { path, data, isLast, fetchPosts };
  } else if (type === "taggedPosts") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { path, data, isLast, fetchTaggedPosts };
  } else {
    //type == "alarms"
    const data = cache ? (cache.data as IAlarm[]) : [];
    return { path, data, isLast, fetchAlarms };
  }
};
