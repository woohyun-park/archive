import { mergeTailwindClasses } from "apis/tailwind";
import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import Loader from "../atoms/Loader";

type Props = {
  children: React.ReactNode;
  refetch: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPullable?: boolean;
  className?: string;
  lastPage?: React.ReactNode;
};

export default function WrapPullToRefresh({
  children,
  refetch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPullable = true,
  className = "",
  lastPage = <></>,
}: Props) {
  return (
    <PullToRefresh
      onRefresh={refetch}
      onFetchMore={fetchNextPage}
      canFetchMore={hasNextPage}
      pullingContent={<Loader />}
      refreshingContent={<Loader />}
      isPullable={isPullable}
      className={mergeTailwindClasses("bg-white", className)}
    >
      <>
        {children}
        {isFetchingNextPage && <Loader />}
        {!hasNextPage && lastPage}
      </>
    </PullToRefresh>
  );
}
