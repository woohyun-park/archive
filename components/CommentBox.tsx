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
import { db, getDataByRef } from "../apis/firebase";
import { IAlarm, IComment, IPost, IUser } from "../libs/custom";
import { useRouter } from "next/router";
import Action from "./Action";
import Textarea from "./atoms/Textarea";
import Btn from "./atoms/Btn";
import InfinitePage from "./InfinitePage";
import { usePost } from "../stores/usePost";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  setPost: React.Dispatch<React.SetStateAction<IPost>>;
};

export default (function CommentBox({ post, user, setPost }: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const { comments, getComments } = usePost();
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
    const newAlarm: IAlarm = {
      uid: user.id,
      type: "comment",
      targetUid: post.uid,
      targetPid: post.id,
      createdAt: new Date(),
    };
    const alarmRef = await addDoc(collection(db, "alarms"), newAlarm);

    const tempComment: IComment = {
      uid: user.id,
      pid: post.id || "",
      aid: alarmRef.id,
      txt: comment,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    await updateDoc(ref, {
      id: ref.id,
    });
    await updateDoc(alarmRef, { id: alarmRef.id, targetCid: ref.id });
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
    await deleteDoc(
      doc(
        db,
        "alarms",
        post.comments?.find((comment) => comment.id === id)?.aid || ""
      )
    );
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
      <InfinitePage
        page="post"
        data={comments[post.id || ""] || []}
        onIntersect={() => getComments("load", post.id || "")}
        onChange={() => {}}
        onRefresh={async () => {
          await getComments("refresh", post.id || "");
        }}
        onClick={handleDeleteComment}
        changeListener={comments[post.id || ""]}
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
