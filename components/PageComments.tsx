import { deleteDoc, doc } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { IFetchQueryComments } from "../apis/fbDef";
import { db } from "../apis/firebase";
import { useCachedPage } from "../hooks/useCachedPage";
import { IComment } from "../libs/custom";
import { useUser } from "../stores/useUser";
import Comment from "./Comment";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageCommentsProps {
  query: IFetchQueryComments;
  className?: string;
}

export default function PageComments({ query, className }: IPageCommentsProps) {
  const { curUser } = useUser();
  const { data, onRefresh, onFetchMore, canFetchMore } = useCachedPage(
    "comments",
    query
  );
  const comments = data as IComment[];

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
      <WrapPullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
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
      </WrapPullToRefresh>
    </>
  );
}
