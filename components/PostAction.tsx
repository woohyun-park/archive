import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { RefObject, useRef, useState } from "react";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiHeart,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IPost, IStyle, IUser, SIZE } from "../custom";
import Comment from "./Comment";

type IPostActionProps = {
  post: IPost;
  style: IStyle;
};

interface ITempComment {
  uid: string;
  createdAt: FieldValue;
  txt: string;
}

export default function PostAction({ post, style }: IPostActionProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [initIsLiked, setInitIsLiked] = useState(
    curUser.likes.find((elem) => elem === post.id) ? true : false
  );
  const [initIsScraped, setInitIsScraped] = useState(
    curUser.scraps.find((elem) => elem === post.id) ? true : false
  );
  const [isLiked, setIsLiked] = useState(
    curUser.likes.find((elem) => elem === post.id) ? true : false
  );
  const [isScraped, setIsScraped] = useState(
    curUser.scraps.find((elem) => elem === post.id) ? true : false
  );
  const [comment, setComment] = useState("");
  const commentRef: RefObject<HTMLInputElement> = useRef(null);

  async function handleToggleLike() {
    const postRef = doc(db, "posts", post.id || "");
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(curUser.uid),
      });
    }
    const tempLikes = new Set(curUser.likes);
    if (isLiked) {
      tempLikes.delete(post.id || "");
    } else {
      tempLikes.add(post.id || "");
    }
    const likes = Array.from(tempLikes) as string[];
    setCurUser({ ...curUser, likes });
    updateCurUser({ ...curUser, likes });

    setIsLiked(!isLiked);
  }
  async function handleToggleScrap() {
    const postRef = doc(db, "posts", post.id || "");
    if (isScraped) {
      await updateDoc(postRef, {
        scraps: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        scraps: arrayUnion(curUser.uid),
      });
    }
    const tempScraps = new Set(curUser.scraps);
    if (isScraped) {
      tempScraps.delete(post.id || "");
    } else {
      tempScraps.add(post.id || "");
    }
    const scraps = Array.from(tempScraps) as string[];
    setCurUser({ ...curUser, scraps });
    updateCurUser({ ...curUser, scraps });

    setIsScraped(!isScraped);
  }

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
    console.log(ref.id, post.id);
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayUnion(ref.id),
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
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayRemove(id),
    });
    // Update user comments array
    const comments = [...curUser.comments].filter((e) => e !== id);
    setCurUser({ ...curUser, comments });
    updateCurUser({ ...curUser, comments });
  }
  function handleCommentClick(e: React.MouseEvent<SVGElement>) {
    commentRef.current?.focus();
  }
  function displayLike() {
    if (initIsLiked) {
      if (isLiked) {
        return post.likes.length;
      } else {
        return post.likes.length - 1;
      }
    } else {
      if (isLiked) {
        return post.likes.length + 1;
      } else {
        return post.likes.length;
      }
    }
  }
  function displayScraps() {
    if (initIsScraped) {
      if (isScraped) {
        return post.scraps.length;
      } else {
        return post.scraps.length - 1;
      }
    } else {
      if (isScraped) {
        return post.scraps.length + 1;
      } else {
        return post.scraps.length;
      }
    }
  }

  return (
    <>
      <div className="cont">
        <div>
          <span className="heart">
            {isLiked ? (
              <HiHeart size={SIZE.icon} onClick={handleToggleLike} />
            ) : (
              <HiOutlineHeart size={SIZE.icon} onClick={handleToggleLike} />
            )}
          </span>
          <span>
            <HiOutlineChatBubbleOvalLeft
              size={SIZE.icon}
              onClick={handleCommentClick}
            />
          </span>
        </div>
        <div>
          <span>
            {isScraped ? (
              <HiBookmark onClick={handleToggleScrap} size={SIZE.icon} />
            ) : (
              <HiOutlineBookmark onClick={handleToggleScrap} size={SIZE.icon} />
            )}
          </span>
        </div>
      </div>
      <div className="count">
        <div>
          {`좋아요 ${style === "feed" ? displayLike() : post.likes.length}`}
          &nbsp;&nbsp;
          {`댓글 ${post.comments.length}`}
        </div>
        <div>{`스크랩 ${
          style === "feed" ? displayScraps() : post.scraps.length
        }`}</div>
      </div>
      {style === "post" &&
        post.comments.map((id) => <Comment id={id} onClick={handleDelete} />)}
      {style === "post" && (
        <div className="inputCont">
          <img className="img" src={curUser.photoURL} />
          <input
            className="g-button2 input"
            placeholder={`${curUser.displayName}(으)로 댓글 달기...`}
            value={comment}
            onChange={handleChange}
            ref={commentRef}
          />
          <button className="g-button1 button" onClick={handleSubmit}>
            게시
          </button>
        </div>
      )}

      <style jsx>
        {`
          .cont {
            display: flex;
            justify-content: space-between;
            margin: 8px 0 2px 0;
          }
          .heart {
            margin-right: 8px;
          }
          .count {
            font-size: 12px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
          }
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
          .button:hover,
          span:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
