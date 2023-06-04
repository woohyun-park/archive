import { Children, useEffect, useRef, useState } from "react";
import { IComment, IPost, IUser } from "../apis/def";
import { deleteDoc, doc } from "firebase/firestore";

import Action from "./Action";
import { AnimatePresence } from "framer-motion";
import { Button } from "./atoms";
import Comment from "./molecules/Comment/Comment";
import ProfileImg from "./ProfileImg";
import Textarea from "./atoms/Textarea/Textarea";
import { WrapMotionFloat } from "./wrappers/motion";
import { createComment } from "../apis/firebase/fbCreate";
import { db } from "../apis/firebase/fb";
import { readComment } from "../apis/firebase/fbRead";
import { useRouter } from "next/router";
import { useUser } from "providers";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  className?: string;
  onRefresh: Function;
};

export default function CommentBox({ post, user, className, onRefresh }: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const [submitListener, setSubmitListener] = useState<boolean | null>(null);
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const { data: curUser } = useUser();

  const uid = user.id;
  const targetUid = post.uid;
  const pid = post.id || "";

  useEffect(() => {
    if (submitListener !== null)
      actionRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
      });
  }, [submitListener]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const newCommentRef = await createComment(uid, targetUid, pid, comment);
    const newComment = await readComment(newCommentRef.id);
    if (!newComment) return;
    setComment("");
    onRefresh();
    setSubmitListener(!submitListener);
  };

  const handleDeleteComment = async (comment: IComment) => {
    await deleteDoc(doc(db, "comments", comment.id));
    curUser.id !== comment.uid && (await deleteDoc(doc(db, "alarms", comment.aid || "")));
    onRefresh();
  };

  const handleProfileClick = (uid: string) => {
    router.push(`/profile/${uid}`);
  };

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
        {Children.toArray(
          post.comments?.map((comment) => {
            return (
              <WrapMotionFloat>
                <Comment
                  comment={comment}
                  user={user}
                  curUser={curUser}
                  onProfileClick={() => handleProfileClick(user.id)}
                  onDelete={() => handleDeleteComment(comment)}
                />
              </WrapMotionFloat>
            );
          })
        )}
      </AnimatePresence>
      <div className="fixed bottom-0 flex items-center justify-between py-4 bg-white w-[calc(100vw_-_2rem)] max-w-[calc(480px_-_2rem)]">
        <ProfileImg photoURL={user.photoURL} size="sm" />
        <Textarea
          value={comment}
          placeholder={`${user.displayName}(으)로 댓글 달기...`}
          onChange={handleChange}
          ref={commentRef}
          autoFocus={router.query.isCommentFocused ? true : false}
          minRows={1}
          className="mx-2"
        />
        <Button label="게시" onClick={handleSubmit} />
      </div>
    </div>
  );
}
