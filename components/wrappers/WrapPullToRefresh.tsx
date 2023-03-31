import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import Loader from "../Loader";

// PullToRefresh를 손쉽게 사용하기 위한 wrapper 컴포넌트

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
  function LoaderWithPadding() {
    return (
      <>
        <Loader isVisible={true} />
        <div className="pb-6" />
      </>
    );
  }

  return (
    <PullToRefresh
      onRefresh={onRefresh}
      onFetchMore={onFetchMore}
      canFetchMore={canFetchMore}
      pullingContent={<LoaderWithPadding />}
      refreshingContent={<LoaderWithPadding />}
      isPullable={isPullable}
      className={className}
    >
      <>{children}</>
    </PullToRefresh>
  );
}
