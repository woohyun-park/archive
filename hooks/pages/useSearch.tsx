import {
  collection,
  endAt,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";
import { db, readPosts } from "apis/firebase";

import { FETCH_LIMIT } from "consts/firebase";
import { IInfiniteScroll } from "consts/infiniteScroll";
import { useInfiniteScroll } from "hooks";

export default function useSearch(): IInfiniteScroll {
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
