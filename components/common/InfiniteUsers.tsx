import React, { Children } from "react";

import { IInfiniteScroll } from "consts/infiniteScroll";
import Profile from "components/Profile";
import { WrapMotionFade } from "components/wrappers/motion";
import WrapPullToRefresh from "../wrappers/WrapPullToRefresh";
import { useUser } from "providers";

type Props = {
  infiniteScroll: IInfiniteScroll;

  lastPage?: React.ReactNode;
  className?: string;
  isPullable?: boolean;
};

export default function InfiniteUsers({
  infiniteScroll,
  lastPage,
  className,
  isPullable = true,
}: Props) {
  const { data, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } =
    infiniteScroll;
  const { data: curUser } = useUser();

  return (
    <WrapMotionFade className={className}>
      <WrapPullToRefresh
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage || false}
        isFetchingNextPage={isFetchingNextPage}
        lastPage={lastPage}
        isPullable={isPullable}
      >
        <div className="mx-4">
          {Children.toArray(
            data.map((user, i) => (
              <>
                <Profile
                  user={user}
                  info="intro"
                  action={curUser.id !== user.id ? "follow" : undefined}
                />
              </>
            ))
          )}
        </div>
      </WrapPullToRefresh>
    </WrapMotionFade>
  );
}
