import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import Loader from "../Loader";

interface IWrapPullToRefresh {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  onFetchMore: () => Promise<void>;
  canFetchMore?: boolean;
  isPullable?: boolean;
  className?: string;
}

export default function WrapPullToRefresh({
  children,
  onRefresh,
  onFetchMore,
  canFetchMore = true,
  isPullable = true,
  className,
}: IWrapPullToRefresh) {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      onFetchMore={onFetchMore}
      canFetchMore={canFetchMore}
      pullingContent={<Loader isVisible={true} />}
      refreshingContent={<Loader isVisible={true} />}
      isPullable={isPullable}
      className={className}
    >
      <>{children}</>
    </PullToRefresh>
  );
}
