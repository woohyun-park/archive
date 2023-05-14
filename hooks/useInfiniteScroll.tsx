import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  getDocs,
} from "firebase/firestore";

import { IPageParam } from "consts/firebase";
import { uniqueId } from "lodash";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useInfiniteScroll(params: {
  queryKey: string[];
  queryFn: (docs: QueryDocumentSnapshot<DocumentData>[]) => Promise<any>;
  query: (pageParam: IPageParam) => {
    init: Query<DocumentData>;
    load: Query<DocumentData>;
    refresh: Query<DocumentData>;
    refreshNew: Query<DocumentData>;
  };
}) {
  const { queryKey, queryFn, query } = params;
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
      return lastPage && allPages[0] && lastPage.nextCursor
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

  const formatPages = (pages: any[] | undefined) => {
    if (!pages || !pages[0]) return [];
    return pages?.reduce((acc: any[], cur) => [...acc, ...cur.data], []);
  };

  async function fetch(pageParam: IPageParam) {
    try {
      console.log(`Started Fetching ${queryKey}...`);
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
      console.log(`Done Fetching ${queryKey}!`, data);
      return {
        id: uniqueId(),
        isFirstPage,
        data,
        prevCursor: newPrevCursor,
        nextCursor: newNextCursor,
      };
    } catch (e) {
      console.log(e);
    }
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
}
