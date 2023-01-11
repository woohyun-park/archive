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
import { useRouter } from "next/router";
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
import { COLOR, IPost, IStyle, SIZE } from "../custom";
import Comment from "./Comment";

type IPostActionProps = {
  post: IPost;
  style: IStyle;
};

interface ITempComment {
  uid: string;
  createdAt: FieldValue;
  txt: string;
  target: string;
}

export default function PostAction({ post, style }: IPostActionProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [status, setStatus] = useState({
    initIsLiked: curUser.likes.find((elem) => elem === post.id) ? true : false,
    isLiked: curUser.likes.find((elem) => elem === post.id) ? true : false,
    initIsScraped: curUser.scraps.find((elem) => elem === post.id)
      ? true
      : false,
    isScraped: curUser.scraps.find((elem) => elem === post.id) ? true : false,
  });
  const [comment, setComment] = useState("");
  const commentRef: RefObject<HTMLInputElement> = useRef(null);
  const router = useRouter();

  async function handleToggleLike() {
    const postRef = doc(db, "posts", post.id || "");
    if (status.isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(curUser.uid),
      });
    }
    const tempLikes = new Set(curUser.likes);
    if (status.isLiked) {
      tempLikes.delete(post.id || "");
    } else {
      tempLikes.add(post.id || "");
    }
    const likes = Array.from(tempLikes) as string[];
    setCurUser({ ...curUser, likes });
    updateCurUser({ ...curUser, likes });
    setStatus({ ...status, isLiked: !status.isLiked });
  }
  async function handleToggleScrap() {
    const postRef = doc(db, "posts", post.id || "");
    if (status.isScraped) {
      await updateDoc(postRef, {
        scraps: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        scraps: arrayUnion(curUser.uid),
      });
    }
    const tempScraps = new Set(curUser.scraps);
    if (status.isScraped) {
      tempScraps.delete(post.id || "");
    } else {
      tempScraps.add(post.id || "");
    }
    const scraps = Array.from(tempScraps) as string[];
    setCurUser({ ...curUser, scraps });
    updateCurUser({ ...curUser, scraps });
    setStatus({ ...status, isScraped: !status.isScraped });
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const tempComment: ITempComment = {
      uid: curUser.uid,
      createdAt: serverTimestamp(),
      txt: comment,
      target: post.id,
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayUnion(ref.id),
    });
    setComment("");
  }
  async function handleDelete(e: React.MouseEvent<SVGElement>) {
    const id = e.currentTarget.id;
    await deleteDoc(doc(db, "comments", id));
    await updateDoc(doc(db, "posts", post.id), {
      comments: arrayRemove(id),
    });
  }
  function handleCommentClick(e: React.MouseEvent<SVGElement>) {
    if (style === "post") {
      commentRef.current?.focus();
    } else if (style === "feed") {
      router.push(
        {
          pathname: `/post/${post.id}`,
          query: { isCommentFocused: true },
        },
        `/post/${post.id}`
      );
    }
  }
  function displayLike() {
    if (status.initIsLiked) {
      if (status.isLiked) {
        return post.likes.length;
      } else {
        return post.likes.length - 1;
      }
    } else {
      if (status.isLiked) {
        return post.likes.length + 1;
      } else {
        return post.likes.length;
      }
    }
  }
  function displayScraps() {
    if (status.initIsScraped) {
      if (status.isScraped) {
        return post.scraps.length;
      } else {
        return post.scraps.length - 1;
      }
    } else {
      if (status.isScraped) {
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
            {status.isLiked ? (
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
            {status.isScraped ? (
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
            autoFocus={router.query.isCommentFocused ? true : false}
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
