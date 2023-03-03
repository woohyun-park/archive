import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IPost } from "../libs/custom";
import { IFetchQueryPosts, IFetchType } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import PostBox from "./PostBox";
import PostCard from "./PostCard";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPagePostsProps {
  query: IFetchQueryPosts;
  as: string;
  numCols: 1 | 2 | 3;
  className?: string;
}

export default function PagePosts({
  query,
  as,
  numCols = 1,
  className,
}: IPagePostsProps) {
  const router = useRouter();

  const cache = useCachedPage("posts", as);
  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const path = router.asPath;

  const posts = cache.data as IPost[];
  function onIntersect() {
    cache.fetchPosts && cache.fetchPosts("load", query, path, as, numCols);
  }
  function onChange() {}
  async function onRefresh() {
    cache.fetchPosts &&
      (await cache.fetchPosts("refresh", query, path, as, numCols));
  }
  const changeListener = posts;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        cache.fetchPosts &&
          (await cache.fetchPosts("init", query, path, as, numCols));
      }
      setModalLoader(false);
    }
    init();
  }, []);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });

  return (
    <>
      <WrapRefreshAndLoad
        onRefresh={onRefresh}
        loading={loading}
        className={className}
      >
        {numCols === 1 && (
          <AnimatePresence>
            {Children.toArray(
              posts.map((e, i) => (
                <div>
                  <PostCard post={e as IPost} />
                  {!isLast && i === posts.length - 1 && (
                    <div ref={setLastIntersecting}></div>
                  )}
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
                <>
                  <PostBox
                    type="titleAndTags"
                    post={{ ...post, id: post.id }}
                  />
                  {!isLast && i === posts.length - 1 && (
                    <div ref={setLastIntersecting}></div>
                  )}
                </>
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
                <>
                  <div>
                    <PostBox type="title" post={{ ...post, id: post.id }} />
                  </div>
                  {!isLast && i === posts.length - 1 && (
                    <div ref={setLastIntersecting}></div>
                  )}
                </>
              ))
            )}
          </div>
        )}
      </WrapRefreshAndLoad>
    </>
  );
}
