import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { db } from "../apis/firebase";
import { IComment, IPost, IUser } from "../libs/custom";
import { useRouter } from "next/router";
import Action from "./Action";
import Textarea from "./atoms/Textarea";
import Btn from "./atoms/Btn";
import { createComment } from "../apis/fbCreate";
import { readComment } from "../apis/fbRead";
import { FETCH_LIMIT } from "../apis/fbDef";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  setPost: React.Dispatch<React.SetStateAction<IPost | null | undefined>>;
};

export default (function CommentBox({ post, user, setPost }: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(FETCH_LIMIT.comment);
  const [submitListener, setSubmitListener] = useState<boolean | null>(null);
  const router = useRouter();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const uid = user.id;
  const targetUid = post.uid;
  const pid = post.id || "";

  useEffect(() => {
    if (submitListener !== null)
      actionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [submitListener]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const newCommentRef = await createComment(uid, targetUid, pid, comment);
    const newComment = await readComment(newCommentRef.id);
    if (!newComment) return;
    setComment("");
    setPost({
      ...post,
      comments: [newComment, ...(post.comments as IComment[])],
    });
    setSubmitListener(!submitListener);
    setPage(page + 1);
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
        (post) => post.id !== id
      ),
    });
    setPage(page - 1);
  }

  return (
    <>
      <Action
        post={post}
        curUser={user}
        onCommentClick={() => {
          commentRef.current?.focus({});
        }}
        ref={actionRef}
      />
      {/* <Page
        page="post"
        data={post.comments?.slice(0, page) || []}
        onIntersect={() =>
          setTimeout(() => setPage(page + FETCH_LIMIT.comment), 500)
        }
        onChange={() => {}}
        onRefresh={async () => {}}
        onClick={handleDeleteComment}
        changeListener={page}
        isLast={post.comments && post.comments?.length <= page}
      /> */}
      <div className="fixed bottom-0 flex items-center justify-between py-4 bg-white w-[calc(100vw_-_2rem)] max-w-[calc(480px_-_2rem)]">
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
