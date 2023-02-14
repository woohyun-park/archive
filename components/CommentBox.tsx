import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { addComment, db, getDataByRef } from "../apis/firebase";
import { IAlarm, IComment, IPost, IUser } from "../libs/custom";
import { useRouter } from "next/router";
import Action from "./Action";
import Textarea from "./atoms/Textarea";
import Btn from "./atoms/Btn";
import InfinitePage from "./InfinitePage";
import { usePost } from "../stores/usePost";
import { User } from "firebase/auth";
import { AnimatePresence } from "framer-motion";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  setPost: React.Dispatch<React.SetStateAction<IPost>>;
};

export default (function CommentBox({ post, user, setPost }: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const { comments, getComments, setComments, isLasts } = usePost();
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const uid = user.id;
  const targetUid = post.uid;
  const targetPid = post.id || "";

  const [submitListener, setSubmitListener] = useState<boolean | null>(null);
  useEffect(() => {
    if (submitListener !== null)
      actionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitListener]);
  useEffect(() => {
    !comments[targetPid] && getComments("init", targetPid);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const newComment = await addComment(uid, targetUid, targetPid, comment);
    setComment("");
    setComments([newComment, ...comments[post.id || ""]], targetPid);
    setSubmitListener(!submitListener);
  }
  async function handleDeleteComment(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    await deleteDoc(doc(db, "comments", id));
    await deleteDoc(
      doc(
        db,
        "alarms",
        comments[targetPid].find((comment) => comment.id === id)?.aid || ""
      )
    );
    setComments(
      [...comments[targetPid]].filter((comment) => comment.id !== id),
      targetPid
    );
  }
  return (
    <>
      <Action
        post={post}
        curUser={user}
        onCommentClick={() => {
          commentRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => commentRef.current?.focus({}), 500);
        }}
        ref={actionRef}
      />
      <InfinitePage
        page="post"
        data={comments[targetPid] || []}
        onIntersect={() => getComments("load", targetPid)}
        onChange={() => {}}
        onRefresh={async () => {
          await getComments("refresh", targetPid);
        }}
        onClick={handleDeleteComment}
        changeListener={comments[targetPid]}
        isLast={isLasts[targetPid]}
      />

      <div className="sticky bottom-0 flex items-center justify-between w-full py-4 bg-white">
        <div className="profileImg-sm">
          <Image src={user.photoURL} alt="" fill />
        </div>
        <Textarea
          value={comment}
          placeholder={`${user.displayName}(으)로 댓글 달기...`}
          onChange={handleChange}
          ref={commentRef}
          autoFocus={router.query.isCommentFocused ? true : false}
          style={{
            marginLeft: "0.5rem",
            marginRight: "0.5rem ",
          }}
        />
        <Btn label="게시" onClick={handleSubmit} />
      </div>
    </>
  );
});
