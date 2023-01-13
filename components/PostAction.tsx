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
import { COLOR, IComment, IPost, IStyle, SIZE } from "../custom";
import Comment from "./Comment";

type IPostActionProps = {
  post: IPost;
  style: IStyle;
};

export default function PostAction({ post, style }: IPostActionProps) {
  const { curUser, setCurUser, updateCurUser, refreshCurUser } = useStore();
  const [status, setStatus] = useState({
    initIsLiked: curUser.likes?.find((elem) => elem.pid === post.id)
      ? true
      : false,
    isLiked: curUser.likes?.find((elem) => elem.pid === post.id) ? true : false,
    initIsScraped: curUser.scraps?.find((elem) => elem.pid === post.id)
      ? true
      : false,
    isScraped: curUser.scraps?.find((elem) => elem.pid === post.id)
      ? true
      : false,
  });
  const [comment, setComment] = useState("");
  const commentRef: RefObject<HTMLInputElement> = useRef(null);
  const router = useRouter();

  async function handleToggleLike() {
    const postRef = doc(db, "posts", post.id || "");
    if (status.isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(curUser.id),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(curUser.id),
      });
    }
    const curUserLike = post.likes?.filter((like) => like.uid === curUser.id);
    console.log(curUserLike);
    refreshCurUser(curUser.id);
    setStatus({ ...status, isLiked: !status.isLiked });
  }
  async function handleToggleScrap() {
    const postRef = doc(db, "posts", post.id || "");
    if (status.isScraped) {
      await updateDoc(postRef, {
        scraps: arrayRemove(curUser.id),
      });
    } else {
      await updateDoc(postRef, {
        scraps: arrayUnion(curUser.id),
      });
    }
    refreshCurUser(curUser.id);
    setStatus({ ...status, isScraped: !status.isScraped });
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComment(e.target.value);
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const tempComment: IComment = {
      uid: curUser.id,
      pid: post.id || "",
      txt: comment,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    refreshCurUser(curUser.id);
    setComment("");
  }
  async function handleDelete(e: React.MouseEvent<SVGElement>) {
    const id = e.currentTarget.id;
    await deleteDoc(doc(db, "comments", id));
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
    const len = post.likes?.length;
    if (len === undefined) return 0;
    if (status.initIsLiked) {
      if (status.isLiked) {
        return len;
      } else {
        return len - 1;
      }
    } else {
      if (status.isLiked) {
        return len + 1;
      } else {
        return len;
      }
    }
  }
  function displayScraps() {
    const len = post.scraps?.length;
    if (len === undefined) return 0;
    if (status.initIsScraped) {
      if (status.isScraped) {
        return len;
      } else {
        return len - 1;
      }
    } else {
      if (status.isScraped) {
        return len + 1;
      } else {
        return len;
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
          {`좋아요 ${style === "feed" ? displayLike() : post.likes?.length}`}
          &nbsp;&nbsp;
          {`댓글 ${post.comments?.length}`}
        </div>
        <div>{`스크랩 ${
          style === "feed" ? displayScraps() : post.scraps?.length
        }`}</div>
      </div>
      {style === "post" &&
        post.comments?.map((comment) => (
          <Comment comment={comment} onClick={handleDelete} />
        ))}
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
