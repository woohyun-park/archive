import { AnimatePresence } from "framer-motion";
import React, { Children } from "react";
import { IPost } from "../../apis/def";
import PostCard from "../PostCard";
import WrapPullToRefresh from "../wrappers/WrapPullToRefresh";

export type IPostsColOne = {
  data: IPost[] | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  refetch: () => Promise<any>;
  fetchNextPage: () => Promise<any>;
};

export default function PostsColOne({
  data = [],
  hasNextPage = false,
  isFetchingNextPage,
  refetch,
  fetchNextPage,
}: IPostsColOne) {
  return (
    <>
      <WrapPullToRefresh
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      >
        <AnimatePresence>
          {Children.toArray(
            data.map((e, i) => (
              <div key={e.id}>
                <PostCard post={e as IPost} />
                <hr className="w-full h-4 text-white bg-white" />
              </div>
            ))
          )}
        </AnimatePresence>
      </WrapPullToRefresh>
    </>
  );
}
