import Message from "components/Message";
import { AlarmComment, AlarmFollow, AlarmLike } from "components/pages/alarm";
import { WrapMotionFade, WrapMotionFloat } from "components/wrappers/motion";
import React from "react";
import { IAlarm } from "apis/def";
import { IField } from "consts/firebase";
import WrapPullToRefresh from "components/wrappers/WrapPullToRefresh";

type Props = {
  data: IAlarm[] | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
  mutate: (fields: IField[]) => void;
  lastPage?: React.ReactNode;
  className?: string;
};

export default function InfiniteAlarms({
  data = [],
  hasNextPage = false,
  isFetchingNextPage,
  refetch,
  mutate,
  fetchNextPage,
  lastPage,
  className,
}: Props) {
  return (
    <WrapMotionFade className={className}>
      <WrapPullToRefresh
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
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
