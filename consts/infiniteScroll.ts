import {
  FetchNextPageOptions,
  RefetchOptions,
  RefetchQueryFilters,
  UseMutateFunction,
} from "@tanstack/react-query";

import { IField } from "./firebase";

export type IInfiniteScroll = {
  data: any[];
  isLoading: boolean;
  isRefetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  error: unknown;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<any>;
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<any>;
};

export type IInfiniteScrollMutate = {
  mutate: UseMutateFunction<void, unknown, IField[], unknown>;
} & IInfiniteScroll;
