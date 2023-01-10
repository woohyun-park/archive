import {
  addDoc,
  collection,
  doc,
  FieldValue,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IComment, IPost, IUser } from "../custom";
import Comment from "./Comment";

type IPostCommentProps = {
  post: IPost;
  comments: string[];
};

interface ITempComment {
  uid: string;
  createdAt: FieldValue;
  txt: string;
}

export default function PostComment({ post, comments }: IPostCommentProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [comment, setComment] = useState("");
  function handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComment(e.target.value);
  }
  async function handleCommentSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const tempComment: ITempComment = {
      uid: curUser.uid,
      createdAt: serverTimestamp(),
      txt: comment,
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);

    const tempPostComments = [...post.comments];
    tempPostComments.push(ref.id);
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, { comments: tempPostComments });

    const comments = [...curUser.comments];
    comments.push(ref.id);
    setCurUser({ ...curUser, comments });
    updateCurUser({ ...curUser, comments });
  }

  return (
    <>
      {comments.map((id) => (
        <Comment id={id} />
      ))}
      <div className="inputCont">
        <img className="img" src={curUser.photoURL} />
        <input
          className="g-button2 input"
          placeholder={`${curUser.displayName}(으)로 댓글 달기...`}
          value={comment}
          onChange={handleCommentChange}
        />
        <button className="g-button1 button" onClick={handleCommentSubmit}>
          개시
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
