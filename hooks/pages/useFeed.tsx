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
import { db, readPosts } from "apis/firebase";
import { useInfiniteScroll } from "hooks";
import { FETCH_LIMIT } from "consts/firebase";
import { useUser } from "contexts/UserProvider";

export default function useFeed() {
  const userContext = useUser();
  const { followings } = userContext.data;
  console.log(followings);

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
  } = useInfiniteScroll(["feed"], readPosts, (pageParams) => {
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
