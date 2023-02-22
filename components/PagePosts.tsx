import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IPost } from "../libs/custom";
import { ICacheType } from "../stores/useCacheHelper";
import { useUser } from "../stores/useUser";
import Loader from "./Loader";
import PostBox from "./PostBox";
import PostCard from "./PostCard";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPagePostsProps {
  fetchType: ICacheType;
  numCol: 1 | 2 | 3;
}

export default function PagePosts({
  fetchType = "posts",
  numCol = 1,
}: IPagePostsProps) {
  const router = useRouter();

  const cache = useCachedPage(fetchType);
  const { curUser } = useUser();

  const path = router.asPath;
  const keyword = (router.query.keyword as string) || "";
  const tag = (router.query.tag as string) || "";

  const posts = cache.data as IPost[];
  function onIntersect() {
    if (fetchType === "posts") {
      cache.fetchPosts && cache.fetchPosts("load", path);
    } else if (fetchType === "postsByKeyword") {
      cache.fetchPostsByKeyword &&
        cache.fetchPostsByKeyword("load", path, keyword);
    } else if (fetchType === "postsByTag") {
      cache.fetchPostsByTag && cache.fetchPostsByTag("load", path, tag);
    } else if (fetchType === "postsByUid") {
      cache.fetchPostsByUid && cache.fetchPostsByUid("load", path, curUser.id);
    }
  }
  function onChange() {}
  async function onRefresh() {
    if (fetchType === "posts") {
      cache.fetchPosts && (await cache.fetchPosts("refresh", path));
    } else if (fetchType === "postsByKeyword") {
      cache.fetchPostsByKeyword &&
        (await cache.fetchPostsByKeyword("refresh", path, keyword));
    } else if (fetchType === "postsByTag") {
      cache.fetchPostsByTag &&
        (await cache.fetchPostsByTag("refresh", path, tag));
    } else if (fetchType === "postsByUid") {
      cache.fetchPostsByUid &&
        (await cache.fetchPostsByUid("refresh", path, curUser.id));
    }
  }
  const changeListener = posts;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        if (fetchType === "posts") {
          cache.fetchPosts && (await cache.fetchPosts("init", path));
        } else if (fetchType === "postsByKeyword") {
          cache.fetchPostsByKeyword &&
            (await cache.fetchPostsByKeyword("init", path, keyword));
        } else if (fetchType === "postsByTag") {
          cache.fetchPostsByTag &&
            (await cache.fetchPostsByTag("init", path, tag));
        } else if (fetchType === "postsByUid") {
          cache.fetchPostsByUid &&
            (await cache.fetchPostsByUid("init", path, curUser.id));
        }
      }
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
      <WrapRefreshAndLoad onRefresh={onRefresh} loading={loading}>
        {numCol === 1 && (
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
        {numCol === 2 && (
          <div className="grid grid-cols-2 mt-4 mb-4 gap-y-2 gap-x-2">
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
        {numCol === 3 && (
          <div
            className={
              posts.length !== 0
                ? "grid grid-cols-3 mt-4 mb-4 gap-y-2 gap-x-2"
                : ""
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
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
