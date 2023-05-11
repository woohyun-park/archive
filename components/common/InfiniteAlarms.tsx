import { AlarmComment, AlarmFollow, AlarmLike } from "components/pages/alarm";
import { WrapMotionFade, WrapMotionFloat } from "components/wrappers/motion";

import { IInfiniteScrollMutate } from "consts/infiniteScroll";
import Message from "components/Message";
import React from "react";
import WrapPullToRefresh from "components/wrappers/WrapPullToRefresh";

type Props = {
  infiniteScroll: IInfiniteScrollMutate;

  lastPage?: React.ReactNode;
  className?: string;
};

export default function InfiniteAlarms({
  infiniteScroll,
  lastPage,
  className,
}: Props) {
  const {
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    mutate,
  } = infiniteScroll;
  return (
    <WrapMotionFade className={className}>
      <WrapPullToRefresh
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage || false}
        isFetchingNextPage={isFetchingNextPage}
        lastPage={lastPage}
      >
        {data.length !== 0 ? (
          <>
            {data?.map((alarm, i) => {
              return (
                <WrapMotionFloat
                  key={alarm.id}
                  onClick={() => mutate([{ id: alarm.id, isViewed: true }])}
                >
                  <>
                    {alarm.type === "like" && <AlarmLike alarm={alarm} />}
                    {alarm.type === "comment" && <AlarmComment alarm={alarm} />}
                    {alarm.type === "follow" && <AlarmFollow alarm={alarm} />}
                  </>
                </WrapMotionFloat>
              );
            })}
          </>
        ) : (
          <Message icon="none" detailedMessage="알림이 없습니다" />
        )}
      </WrapPullToRefresh>
    </WrapMotionFade>
  );
}
