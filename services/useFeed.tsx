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
import { db } from "../apis/fb";
import { FETCH_LIMIT } from "../apis/firebase/fbDef";
import { readPosts } from "../apis/firebase/fbRead";
import { useUser } from "../stores/useUser";
import useService from "./useService";

const fetchLimit = FETCH_LIMIT.postsCol1;

export default function useFeed() {
  const { curUser } = useUser();
  const { followings } = curUser;

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    error,
  } = useService(["feed"], readPosts, (pageParams) => {
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
