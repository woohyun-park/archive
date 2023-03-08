import { AnimatePresence } from "framer-motion";
import React, { Children, useEffect, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryPosts } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import useCustomRouter from "../hooks/useCustomRouter";
import { IPost } from "../libs/custom";
import { wrapPromise } from "../stores/libStores";
import { useStatus } from "../stores/useStatus";
import Loader from "./Loader";
import PostBox from "./PostBox";
import PostCard from "./PostCard";

export interface IPagePostsProps {
  query: IFetchQueryPosts;
  as: string;
  numCols: 1 | 2 | 3;
  isPullable?: boolean;
  className?: string;
}

export default function PagePosts({
  query,
  as,
  numCols = 1,
  isPullable = true,
  className,
}: IPagePostsProps) {
  const router = useCustomRouter();
  const { data, canFetchMore, onRefresh, onFetchMore } = useCachedPage(
    "posts",
    query,
    { as, numCols, isPullable }
  );
  const { refreshes, setRefresh } = useStatus();

  const [loading, setLoading] = useState(false);

  const posts = data as IPost[];

  useEffect(() => {
    async function init() {
      await wrapPromise(() => setLoading(true), 0);
      await wrapPromise(() => onRefresh(), 0);
      await wrapPromise(() => {
        setLoading(false);
        setRefresh(router.asPath, false);
      }, 0);
    }
    if (refreshes[router.asPath]) init();
  }, [refreshes[router.asPath]]);

  console.log(router.asPath, canFetchMore);

  return (
    <>
      <Loader isVisible={loading} />
      <PullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
        pullingContent={<Loader isVisible={true} />}
        refreshingContent={<Loader isVisible={true} />}
        isPullable={isPullable}
        className={className}
        fetchMoreThreshold={256}
      >
        <div>
          {numCols === 1 && (
            <AnimatePresence>
              {Children.toArray(
                posts.map((e, i) => (
                  <div key={e.id}>
                    <PostCard post={e as IPost} />
                    <hr className="w-full h-4 text-white bg-white" />
                  </div>
                ))
              )}
            </AnimatePresence>
          )}
          {numCols === 2 && (
            <div className="grid grid-cols-2 m-4 gap-y-2 gap-x-2">
              {Children.toArray(
                posts.map((post, i) => (
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
                posts.length !== 0 ? "grid grid-cols-3 m-4 gap-y-2 gap-x-2" : ""
              }
            >
              {Children.toArray(
                posts.map((post, i) => (
                  <PostBox
                    key={post.id}
                    type="title"
                    post={{ ...post, id: post.id }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </PullToRefresh>
    </>
  );
}
