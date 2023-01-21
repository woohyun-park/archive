import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
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
import { db, getDataByRef } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IComment, ILike, IPost, IScrap, IStyle, SIZE } from "../custom";
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
    const newComment = await getDataByRef<IComment>(ref);
    setPostState({
      ...postState,
      comments: [newComment, ...(postState.comments as IComment[])],
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
      <div className="flex justify-between mt-1 mb-2">
        <div className="flex">
          <span className="mr-2 hover:cursor-pointer">
            {status.isLiked ? (
              <HiHeart size={SIZE.icon} onClick={handleToggleLike} />
            ) : (
              <HiOutlineHeart size={SIZE.icon} onClick={handleToggleLike} />
            )}
          </span>
          <span className="hover:cursor-pointer">
            <HiOutlineChatBubbleOvalLeft
              size={SIZE.icon}
              onClick={handleCommentClick}
            />
          </span>
        </div>
        <div>
          <span className="hover:cursor-pointer">
            {status.isScraped ? (
              <HiBookmark onClick={handleToggleScrap} size={SIZE.icon} />
            ) : (
              <HiOutlineBookmark onClick={handleToggleScrap} size={SIZE.icon} />
            )}
          </span>
        </div>
      </div>
      <div className="flex justify-between mb-2 text-xs">
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
        <div className="flex items-center justify-between">
          <div className="profileImg-small">
            <Image src={gCurUser.photoURL} alt="" fill />
          </div>
          <input
            className="w-full m-2 button-gray text-start"
            placeholder={`${gCurUser.displayName}(으)로 댓글 달기...`}
            value={comment}
            onChange={handleChange}
            ref={commentRef}
            autoFocus={router.query.isCommentFocused ? true : false}
          />
          <button className="button-black min-w-[64px]" onClick={handleSubmit}>
            게시
          </button>
        </div>
      )}
    </>
  );
}
