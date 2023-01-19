import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiHeart,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import {
  COLOR,
  DEFAULT,
  IComment,
  ILike,
  IPost,
  IScrap,
  IStyle,
  SIZE,
} from "../custom";
import Comment from "./Comment";

type IPostActionProps = {
  post: IPost;
  style: IStyle;
};

export default function PostAction({ post, style }: IPostActionProps) {
  const [postState, setPostState] = useState(post);
  const { gCurUser } = useStore();
  const [status, setStatus] = useState({
    isLiked: gCurUser.likes?.find((each) => each.pid === postState.id)
      ? true
      : false,
    lid: gCurUser.likes?.find((each) => each.pid === postState.id)?.id,
    isScraped: gCurUser.scraps?.find((each) => each.pid === postState.id)
      ? true
      : false,
    sid: gCurUser.scraps?.find((each) => each.pid === postState.id)?.id,
  });
  const [comment, setComment] = useState("");
  const commentRef: RefObject<HTMLInputElement> = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setStatus({
      ...status,
      isLiked: gCurUser.likes?.find((each) => each.pid === postState.id)
        ? true
        : false,
      lid: gCurUser.likes?.find((each) => each.pid === postState.id)?.id,
      isScraped: gCurUser.scraps?.find((each) => each.pid === postState.id)
        ? true
        : false,
      sid: gCurUser.scraps?.find((each) => each.pid === postState.id)?.id,
    });
  }, [gCurUser]);

  async function handleToggleLike() {
    if (status.isLiked) {
      await deleteDoc(doc(db, "likes", status.lid || ""));
    } else {
      const newLike: ILike = {
        uid: gCurUser.id,
        pid: postState.id || "",
      };
      const ref = await addDoc(collection(db, "likes"), newLike);
      await updateDoc(ref, {
        id: ref.id,
      });
    }
  }

  async function handleToggleScrap() {
    if (status.isScraped) {
      await deleteDoc(doc(db, "scraps", status.sid || ""));
    } else {
      const newScrap: IScrap = {
        uid: gCurUser.id,
        pid: postState.id || "",
        cont: "모든 스크랩",
      };
      const ref = await addDoc(collection(db, "scraps"), newScrap);
      await updateDoc(ref, {
        id: ref.id,
      });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setComment(e.target.value);
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    const tempComment: IComment = {
      uid: gCurUser.id,
      pid: postState.id || "",
      txt: comment,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "comments"), tempComment);
    await updateDoc(ref, {
      id: ref.id,
    });
    const commentRef = await getDoc(ref);
    const newComment = commentRef.data() as IComment;
    setPostState({
      ...postState,
      comments: [
        ...(postState.comments as IComment[]),
        { ...newComment, createdAt: commentRef.data()?.createdAt.toDate() },
      ],
    });
    setComment("");
  }

  async function handleDelete(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    const res = await deleteDoc(doc(db, "comments", id));
    setPostState({
      ...postState,
      comments: [...(postState.comments as IComment[])].filter(
        (comment) => comment.id !== id
      ),
    });
  }

  function handleCommentClick(e: React.MouseEvent<SVGElement>) {
    if (style === "post") {
      commentRef.current?.focus();
    } else if (style === "feed") {
      router.push(
        {
          pathname: `/post/${postState.id}`,
          query: { isCommentFocused: true },
        },
        `/post/${postState.id}`
      );
    }
  }
  function displayLike() {
    const len = postState.likes?.length;
    if (len === undefined) return 0;
    if (postState.likes?.find((each) => each.uid === gCurUser.id)) {
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
    const len = postState.scraps?.length;
    if (len === undefined) return 0;
    if (postState.scraps?.find((each) => each.uid === gCurUser.id)) {
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
          {`좋아요 ${displayLike()}`}
          &nbsp;&nbsp;
          {`댓글 ${postState.comments?.length}`}
        </div>
        <div>{`스크랩 ${displayScraps()}`}</div>
      </div>
      {style === "post" &&
        postState.comments?.map((comment) => (
          <Comment comment={comment} onClick={handleDelete} key={comment.id} />
        ))}
      {style === "post" && (
        <div className="inputCont">
          <div className="g-profileImg">
            <Image src={gCurUser.photoURL} alt="" fill />
          </div>
          <input
            className="g-button2 input"
            placeholder={`${gCurUser.displayName}(으)로 댓글 달기...`}
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
