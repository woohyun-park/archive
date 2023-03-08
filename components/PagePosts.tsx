import { AnimatePresence } from "framer-motion";
import React, { Children, useEffect, useState } from "react";
import { IFetchQueryPosts } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { IPost } from "../libs/custom";
import PostBox from "./PostBox";
import PostCard from "./PostCard";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

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
  const { data, isLast, onRefresh, setLastIntersecting, loading } =
    useCachedPage("posts", query, { as, numCols, isPullable });

  const posts = data as IPost[];

  return (
    <>
      <WrapRefreshAndLoad
        onRefresh={onRefresh}
        loading={loading}
        className={className}
        isPullable={isPullable}
      >
        <div>
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
        </div>
      </WrapRefreshAndLoad>
    </>
  );
}
