import { useInfiniteQuery } from "@tanstack/react-query";
import { IPageParam } from "hooks/pages/types";
import {
  DocumentData,
  getDocs,
  Query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { uniqueId } from "lodash";
import { formatPages } from "./pages/utils/formatPages";

export const useInfiniteScroll = (
  queryKey: string[],
  queryFn: (docs: QueryDocumentSnapshot<DocumentData>[]) => Promise<any>,
  query: (pageParam: IPageParam) => {
    init: Query<DocumentData>;
    load: Query<DocumentData>;
    refresh: Query<DocumentData>;
    refreshNew: Query<DocumentData>;
  }
) => {
  const {
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    data,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({
      pageParam = {
        id: null,
        isFirstPage: true,
        prevCursor: null,
        nextCursor: null,
      },
    }) => fetch(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.nextCursor
        ? {
            id: lastPage.id,
            isFirstPage: lastPage.id === allPages[0].id,
            prevCursor: lastPage.prevCursor,
            nextCursor: lastPage.nextCursor,
          }
        : null;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  async function fetch(pageParam: IPageParam) {
    const { isFirstPage, nextCursor, prevCursor } = pageParam;
    const { init, load, refresh, refreshNew } = query(pageParam);
    let q;
    if (isRefetching) {
      if (isFirstPage) {
        q = refreshNew;
      } else {
        q = refresh;
      }
    } else {
      if (nextCursor) {
        q = load;
      } else {
        q = init;
      }
    }
    const snap = await getDocs(q);
    const data = await queryFn(snap.docs);
    const newPrevCursor = snap.docs[0];
    const newNextCursor = snap.docs[snap.docs.length - 1];
    return {
      id: uniqueId(),
      isFirstPage,
      data,
      prevCursor: newPrevCursor,
      nextCursor: newNextCursor,
    };
  }

  return {
    data: formatPages(data?.pages),
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    error,
  };
};
