import {
  collection,
  endAt,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "apis/fb";
import { readPosts } from "apis/firebase";
import { useUser } from "stores/useUser";
import { useInfinitePage } from "hooks";
import { FETCH_LIMIT } from "consts/firebase";

export default function useFeed() {
  const { curUser } = useUser();
  const { followings } = curUser;

  const fetchLimit = FETCH_LIMIT.postsCol1;

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    error,
  } = useInfinitePage(["feed"], readPosts, (pageParams) => {
    return {
      init: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        limit(fetchLimit)
      ),
      load: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(fetchLimit)
      ),
      refresh: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        limit(fetchLimit)
      ),
      refreshNew: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  });

  return {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  };
}
