import { useRouter } from "next/router";
import { IAlarm, IComment, IPost, IScrap, ITag, IUser } from "../libs/custom";
import { useCache } from "../stores/useCache";

export const useCachedPage = (type: string, as?: string) => {
  const router = useRouter();
  const {
    caches,
    fetchPosts,
    fetchUsers,
    fetchTags,
    fetchScraps,
    fetchAlarms,
    fetchComments,
  } = useCache();

  const path = router.asPath;
  const page = caches[path];
  const cache = page && (as ? page[as] : page[type]);
  const isLast = cache ? cache.isLast : false;

  if (type === "posts") {
    const data = cache ? (cache.data as IPost[]) : [];
    return { data, isLast, fetchPosts };
  } else if (type === "comments") {
    const data = cache ? (cache.data as IComment[]) : [];
    return { data, isLast, fetchComments };
  } else if (type === "tags") {
    const data = cache ? (cache.data as ITag[]) : [];
    return { data, isLast, fetchTags };
  } else if (type === "users") {
    const data = cache ? (cache.data as IUser[]) : [];
    return { data, isLast, fetchUsers };
  } else if (type === "scraps") {
    const data = cache ? (cache.data as IScrap[]) : [];
    return { data, isLast, fetchScraps };
  } /* type === "alarms" */ else {
    const data = cache ? (cache.data as IAlarm[]) : [];
    return { data, isLast, fetchAlarms };
  }
};
