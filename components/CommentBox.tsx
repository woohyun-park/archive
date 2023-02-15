import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { addComment, db } from "../apis/firebase";
import { IComment, IPost, IUser } from "../libs/custom";
import { useRouter } from "next/router";
import Action from "./Action";
import Textarea from "./atoms/Textarea";
import Btn from "./atoms/Btn";
import PageInfinite from "./PageInfinite";

type ICommentBoxProps = {
  post: IPost;
  user: IUser;
  setPost: React.Dispatch<React.SetStateAction<IPost>>;
};

const LIMIT = 16;

export default (function CommentBox({ post, user, setPost }: ICommentBoxProps) {
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(LIMIT);
  console.log(page);
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

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const newComment = await addComment(uid, targetUid, targetPid, comment);
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
      <PageInfinite
        page="post"
        data={post.comments?.slice(0, page) || []}
        onIntersect={() => setTimeout(() => setPage(page + LIMIT), 500)}
        onChange={() => {}}
        onRefresh={async () => {}}
        onClick={handleDeleteComment}
        changeListener={page}
        isLast={post.comments?.length === page}
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
