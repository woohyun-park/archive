import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IComment, IPost, IUser } from "../custom";
import Comment from "./Comment";

type IPostCommentProps = {
  post: IPost;
};

interface ITempComment {
  uid: string;
  createdAt: FieldValue;
  txt: string;
}

export default function PostComment({ post }: IPostCommentProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);

  function updateComments() {}
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    // Add comment
    const tempComment: ITempComment = {
      uid: curUser.uid,
      createdAt: serverTimestamp(),
      txt: comment,
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    // Update post comments array
    setComments([...post.comments, ref.id]);
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayRemove(ref.id),
    });
    // Update user comments array
    const comments = [...curUser.comments, ref.id];
    setCurUser({ ...curUser, comments });
    updateCurUser({ ...curUser, comments });
    // Clean input
    setComment("");
  }
  async function handleDelete(e: React.MouseEvent<SVGElement>) {
    // Delete comment
    const id = e.currentTarget.id;
    await deleteDoc(doc(db, "comments", id));
    // Update post comments array
    setComments([...post.comments].filter((e) => e !== id));
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayRemove(id),
    });
    // Update user comments array
    const comments = [...curUser.comments].filter((e) => e !== id);
    setCurUser({ ...curUser, comments });
    updateCurUser({ ...curUser, comments });
  }

  return (
    <>
      {comments.map((id) => (
        <Comment id={id} onClick={handleDelete} />
      ))}
      <div className="inputCont">
        <img className="img" src={curUser.photoURL} />
        <input
          className="g-button2 input"
          placeholder={`${curUser.displayName}(으)로 댓글 달기...`}
          value={comment}
          onChange={handleChange}
        />
        <button className="g-button1 button" onClick={handleSubmit}>
          게시
        </button>
      </div>

      <style jsx>
        {`
          .inputCont {
            display: flex;
            align-items: center;
          }
          .img {
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 8px;
          }
          .input {
            color: ${COLOR.txt1};
            width: 75%;
          }
          .button {
            width: 48px;
            margin: 4px 0 4px 4px;
          }
          .button:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
