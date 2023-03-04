import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { IFetchQueryAlarms, IFetchQueryComments } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IAlarm, IComment, IPost } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import Comment from "./Comment";
import WrapMotion from "./wrappers/WrapMotion";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPageCommentsProps {
  query: IFetchQueryComments;
  className?: string;
}

export default function PageAlarms({ query, className }: IPageCommentsProps) {
  const router = useRouter();

  const cache = useCachedPage("comments");

  const path = router.asPath;

  const comments = cache.data as IComment[];
  function onIntersect() {
    cache.fetchComments && cache.fetchComments("load", query, path);
  }
  function onChange() {}
  async function onRefresh() {
    cache.fetchComments && (await cache.fetchComments("refresh", query, path));
  }
  const changeListener = comments;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        cache.fetchComments && (await cache.fetchComments("init", query, path));
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
      <WrapRefreshAndLoad
        onRefresh={onRefresh}
        loading={loading}
        className={className}
      >
        <AnimatePresence>
          {Children.toArray(
            comments.map((comment, i) => {
              return <Comment comment={comment} />;
            })
          )}
        </AnimatePresence>
      </WrapRefreshAndLoad>
    </>
  );
}
