import PostBox from "components/PostBox";
import { WrapMotionFade } from "components/wrappers/motion";
import WrapMotion from "components/wrappers/motion/WrapMotionFloat";
import { AnimatePresence } from "framer-motion";
import React, { Children } from "react";
import { IPost } from "../../apis/def";
import PostCard from "../PostCard";
import WrapPullToRefresh from "../wrappers/WrapPullToRefresh";

export type IInfinitePosts = {
  numCols: 1 | 2 | 3;
  data: IPost[] | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
  lastPage?: React.ReactNode;
  className?: string;
};

export default function InfinitePosts({
  numCols,
  data = [],
  hasNextPage = false,
  isFetchingNextPage,
  refetch,
  fetchNextPage,
  lastPage,
  className,
}: IInfinitePosts) {
  return (
    <WrapMotionFade className={className}>
      <WrapPullToRefresh
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        lastPage={lastPage}
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
                <PostBox
                  key={post.id}
                  type="titleAndTags"
                  post={{ ...post, id: post.id }}
                />
              ))
            )}
          </div>
        )}
        {numCols === 3 && (
          <div
            className={
              data.length !== 0 ? "grid grid-cols-3 gap-y-2 gap-x-2" : ""
            }
          >
            {Children.toArray(
              data.map((post, i) => (
                <PostBox
                  key={post.id}
                  type="title"
                  post={{ ...post, id: post.id }}
                />
              ))
            )}
          </div>
        )}
      </WrapPullToRefresh>
    </WrapMotionFade>
  );
}
