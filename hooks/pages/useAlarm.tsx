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
import { readAlarms, readPosts, updateAlarms } from "apis/firebase";
import { useInfiniteScroll } from "hooks";
import { FETCH_LIMIT } from "consts/firebase";
import { useUser } from "contexts/UserProvider";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useAlarm() {
  const userContext = useUser();
  const uid = userContext.data.id;

  const fetchLimit = FETCH_LIMIT.alarms;

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    error,
  } = useInfiniteScroll(["alarm"], readAlarms, (pageParams) => {
    return {
      init: query(
        collection(db, "alarms"),
        where("targetUid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(fetchLimit)
      ),
      load: query(
        collection(db, "alarms"),
        where("targetUid", "==", uid),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(fetchLimit)
      ),
      refresh: query(
        collection(db, "alarms"),
        where("tagetUid", "==", uid),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        limit(fetchLimit)
      ),
      refreshNew: query(
        collection(db, "alarms"),
        where("tagetUid", "==", uid),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  });
  const { mutate } = useMutation({
    mutationFn: updateAlarms,
    onSuccess: () => refetch(),
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
    mutate,
  };
}
