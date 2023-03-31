import { deleteDoc, doc } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryComments } from "../apis/fbDef";
import { db } from "../apis/firebase/fb";
import { useCachedPage } from "../hooks/useCachedPage";
import { IComment } from "../apis/interface";
import { useUser } from "../stores/useUser";
import Comment from "./Comment";

export interface IPageCommentsProps {
  query: IFetchQueryComments;
  paddingBottom?: string;
}

export default function PageComments({
  query,
  paddingBottom,
}: IPageCommentsProps) {
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
      <PullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
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
      </PullToRefresh>
      <div className={paddingBottom} />
    </>
  );
}
