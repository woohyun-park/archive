import React, { Children } from "react";

import { IInfiniteScroll } from "consts/infiniteScroll";
import { IPost } from "../../apis/def";
import PostBox from "components/molecules/PostImage/PostImage";
import PostCard from "../molecules/PostCard";
import { WrapMotionFade } from "components/wrappers/motion";
import WrapPullToRefresh from "../wrappers/WrapPullToRefresh";

export type IInfinitePosts = {
  numCols: 1 | 2 | 3;
  infiniteScroll: IInfiniteScroll;

  lastPage?: React.ReactNode;
  className?: string;
  isPullable?: boolean;
};

export default function InfinitePosts({
  numCols,
  infiniteScroll,
  lastPage,
  className,
  isPullable = true,
}: IInfinitePosts) {
  const { data, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } = infiniteScroll;
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
        {numCols === 1 &&
          Children.toArray(
            data.map((e, i) => (
              <div key={e.id}>
                <PostCard post={e as IPost} />
                <hr className="w-full h-4 text-white bg-white" />
              </div>
            ))
          )}
        {numCols === 2 && (
          <div className="grid grid-cols-2 gap-y-2 gap-x-2">
            {Children.toArray(
              data.map((post, i) => (
                <PostBox key={post.id} type="titleAndTags" post={{ ...post, id: post.id }} />
              ))
            )}
          </div>
        )}
        {numCols === 3 && (
          <div className={data.length !== 0 ? "grid grid-cols-3 gap-y-2 gap-x-2" : ""}>
            {Children.toArray(
              data.map((post, i) => (
                <PostBox key={post.id} type="title" post={{ ...post, id: post.id }} />
              ))
            )}
          </div>
        )}
      </WrapPullToRefresh>
    </WrapMotionFade>
  );
}
