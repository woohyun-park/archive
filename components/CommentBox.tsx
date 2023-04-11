import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { db } from "../apis/firebase/fb";
import { IPost, IUser } from "../apis/def";
import { useRouter } from "next/router";
import Action from "./Action";
import Textarea from "./atoms/Textarea";
import Btn from "./atoms/Btn";
import { createComment } from "../apis/firebase/fbCreate";
import { readComment } from "../apis/firebase/fbRead";
import { AnimatePresence } from "framer-motion";
import Comment from "./Comment";
import { useUser } from "../stores/useUser";
import ProfileImg from "./ProfileImg";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  className?: string;
  onRefresh: () => Promise<void>;
};

export default (function CommentBox({
  post,
  user,
  className,
  onRefresh,
}: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const [submitListener, setSubmitListener] = useState<boolean | null>(null);
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const { curUser } = useUser();

  const uid = user.id;
  const targetUid = post.uid;
  const pid = post.id || "";

  useEffect(() => {
    console.log(actionRef.current);
    if (submitListener !== null)
      actionRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
      });
  }, [submitListener]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const newCommentRef = await createComment(uid, targetUid, pid, comment);
    const newComment = await readComment(newCommentRef.id);
    if (!newComment) return;
    setComment("");
    onRefresh();
    setSubmitListener(!submitListener);
  }

  async function handleDeleteComment(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    const comment = post.comments?.find((comment) => comment.id === id);
    await deleteDoc(doc(db, "comments", id));
    curUser.id !== comment?.uid &&
      (await deleteDoc(doc(db, "alarms", comment?.aid || "")));
    onRefresh();
  }

  return (
    <div className={className}>
      <Action
        post={post}
        curUser={user}
        onCommentClick={() => {
          commentRef.current?.focus({});
        }}
        ref={actionRef}
      />
      <AnimatePresence>
        {post.comments?.map((comment, i) => {
          return (
            <Comment
              comment={comment}
              onClick={handleDeleteComment}
              key={comment.id}
            />
          );
        })}
      </AnimatePresence>
      <div className="fixed bottom-0 flex items-center justify-between py-4 bg-white w-[calc(100vw_-_2rem)] max-w-[calc(480px_-_2rem)]">
        <ProfileImg photoURL={user.photoURL} size="sm" />
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
    </div>
  );
});
