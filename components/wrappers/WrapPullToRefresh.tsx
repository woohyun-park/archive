import Message from "components/atoms/Message";
import React, { useEffect, useRef } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { wrapPromise } from "stores/libStores";
import Loader from "../atoms/Loader";

type Props = {
  children: React.ReactNode;
  refetch: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPullable?: boolean;
  className?: string;
};

export default function WrapPullToRefresh({
  children,
  refetch,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPullable = true,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetchingNextPage) {
      wrapPromise(
        () => ref.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
        300
      );
    }
  }, [isFetchingNextPage]);

  return (
    <>
      <div ref={ref} className="bg-white">
        <PullToRefresh
          onRefresh={refetch}
          onFetchMore={fetchNextPage}
          canFetchMore={hasNextPage}
          pullingContent={<Loader />}
          refreshingContent={<Loader />}
          isPullable={isPullable}
          className={className}
        >
          <>{children}</>
        </PullToRefresh>
        {isFetchingNextPage && <Loader />}
        {!hasNextPage && (
          <Message
            icon="wink"
            message="모두 확인했습니다"
            detailedMessage="팔로잉중인 아카이버들의 게시물을 모두 확인했습니다"
          />
        )}
      </div>
    </>
  );
}
