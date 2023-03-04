import { deleteDoc, doc } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { IFetchQueryComments } from "../apis/fbDef";
import { db } from "../apis/firebase";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IComment } from "../libs/custom";
import { useUser } from "../stores/useUser";
import Comment from "./Comment";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPageCommentsProps {
  query: IFetchQueryComments;
  className?: string;
}

export default function PageComments({ query, className }: IPageCommentsProps) {
  const router = useRouter();

  const cache = useCachedPage("comments");
  const { curUser } = useUser();

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

  async function handleDeleteComment(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    const curComment = comments?.find((comment) => comment.id === id);
    await deleteDoc(doc(db, "comments", id));
    curUser.id !== curComment?.uid &&
      (await deleteDoc(doc(db, "alarms", curComment?.aid || "")));
    onRefresh();
  }

  return (
    <>
      <WrapRefreshAndLoad
        onRefresh={onRefresh}
        loading={loading}
        className={className}
      >
        <AnimatePresence>
          {comments.map((comment, i) => {
            return (
              <Comment
                comment={comment}
                onClick={handleDeleteComment}
                key={comment.id}
              />
            );
          })}
        </AnimatePresence>
      </WrapRefreshAndLoad>
    </>
  );
}
