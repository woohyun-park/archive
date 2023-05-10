import {
  collection,
  endAt,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";
import { db } from "apis/fb";
import { readPosts } from "apis/firebase";
import { useInfiniteScroll } from "hooks";
import { FETCH_LIMIT } from "consts/firebase";

export default function useSearch() {
  const fetchLimit = FETCH_LIMIT.postsCol3;

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    error,
  } = useInfiniteScroll(["discover"], readPosts, (pageParams) => {
    return {
      init: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(fetchLimit)
      ),
      load: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(fetchLimit)
      ),
      refresh: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        limit(fetchLimit)
      ),
      refreshNew: query(
        collection(db, "posts"),
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
