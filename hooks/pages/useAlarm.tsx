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
import { db, readAlarms, updateAlarms } from "apis/firebase";

import { FETCH_LIMIT } from "consts/firebase";
import { IInfiniteScrollMutate } from "consts/infiniteScroll";
import { useInfiniteScroll } from "hooks";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "contexts/UserProvider";

export default function useAlarm(): IInfiniteScrollMutate {
  const userContext = useUser();
  const uid = userContext.data?.id;

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
