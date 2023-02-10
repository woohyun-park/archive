import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { Children, useEffect, useRef, useState } from "react";
import { db, getDataByRef } from "../apis/firebase";
import { IComment, IPost, IUser } from "../libs/custom";
import Motion from "../motions/Motion";
import Comment from "./Comment";
import { useRouter } from "next/router";
import Action from "./Action";
import Textarea from "./atoms/Textarea";
import Btn from "./atoms/Btn";
import { AnimatePresence } from "framer-motion";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  setPost: React.Dispatch<React.SetStateAction<IPost>>;
};

export default (function CommentBox({ post, user, setPost }: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const [submitListener, setSubmitListener] = useState<boolean | null>(null);
  useEffect(() => {
    if (submitListener !== null)
      actionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitListener]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const tempComment: IComment = {
      uid: user.id,
      pid: post.id || "",
      txt: comment,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    await updateDoc(ref, {
      id: ref.id,
    });
    const newComment = await getDataByRef<IComment>(ref);
    setPost({
      ...post,
      comments: [newComment, ...(post.comments as IComment[])],
    });
    setComment("");
    setSubmitListener(!submitListener);
  }
  async function handleDeleteComment(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    await deleteDoc(doc(db, "comments", id));
    setPost({
      ...post,
      comments: [...(post.comments as IComment[])].filter(
        (comment) => comment.id !== id
      ),
    });
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
      <AnimatePresence>
        {post.comments &&
          post.comments
            .slice(0, 10)
            .map((e, i) => (
              <Comment comment={e} onClick={handleDeleteComment} key={e.id} />
            ))}
      </AnimatePresence>

      {post.comments && post.comments?.length > 10 && (
        <div className="mb-2 text-xs text-center hover:cursor-pointer">
          {"모두보기"}
        </div>
      )}
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
