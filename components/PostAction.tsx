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
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiHeart,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";
import { db, getDataByRef } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { getRoute, IComment, ILike, IPost, IScrap, SIZE } from "../custom";
import Button from "./atoms/Button";
import Textarea from "./atoms/Textarea";
import Comment from "./Comment";
import MotionFloatList from "../motions/MotionFloatList";

type IPostActionProps = {
  post: IPost;
  setPost: Dispatch<SetStateAction<IPost>>;
  ref: RefObject<HTMLDivElement>;
};

export default function PostAction({ post, setPost, ref }: IPostActionProps) {
  const { gCurUser } = useStore();
  const [status, setStatus] = useState({
    isLiked: gCurUser.likes?.find((each) => each.pid === post.id)
      ? true
      : false,
    lid: gCurUser.likes?.find((each) => each.pid === post.id)?.id,
    isScraped: gCurUser.scraps?.find((each) => each.pid === post.id)
      ? true
      : false,
    sid: gCurUser.scraps?.find((each) => each.pid === post.id)?.id,
  });
  const commentRef: RefObject<HTMLTextAreaElement> = useRef(null);
  const router = useRouter();
  const route = getRoute(router);

  useEffect(() => {
    setStatus({
      ...status,
      isLiked: gCurUser.likes?.find((each) => each.pid === post.id)
        ? true
        : false,
      lid: gCurUser.likes?.find((each) => each.pid === post.id)?.id,
      isScraped: gCurUser.scraps?.find((each) => each.pid === post.id)
        ? true
        : false,
      sid: gCurUser.scraps?.find((each) => each.pid === post.id)?.id,
    });
  }, [gCurUser]);

  async function handleToggleLike() {
    if (status.isLiked) {
      await deleteDoc(doc(db, "likes", status.lid || ""));
    } else {
      const newLike: ILike = {
        uid: gCurUser.id,
        pid: post.id || "",
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
        pid: post.id || "",
        cont: "모든 스크랩",
      };
      const ref = await addDoc(collection(db, "scraps"), newScrap);
      await updateDoc(ref, {
        id: ref.id,
      });
    }
  }

  async function handleDelete(e: React.MouseEvent<HTMLDivElement>) {
    const id = e.currentTarget.id;
    const res = await deleteDoc(doc(db, "comments", id));
    setPost({
      ...post,
      comments: [...(post.comments as IComment[])].filter(
        (comment) => comment.id !== id
      ),
    });
  }

  function handleCommentClick(e: React.MouseEvent<SVGElement>) {
    if (route === "post") {
      commentRef.current?.focus();
    } else if (route === "feed") {
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
    if (post.likes?.find((each) => each.uid === gCurUser.id)) {
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
    if (post.scraps?.find((each) => each.uid === gCurUser.id)) {
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
      <div className="flex justify-between pt-4 mb-2" id="postActionRef">
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
          {`댓글 ${post.comments?.length}`}
        </div>
        <div>{`스크랩 ${displayScraps()}`}</div>
      </div>

      {/* {route === "post" && (
        <>
          <MotionFloatList
            data={(post.comments && post.comments) || []}
            callBack={(comment: IComment) => (
              <Comment
                comment={comment}
                onClick={handleDelete}
                key={comment.id}
              />
            )}
          />
        </>
      )} */}

      {/* {route === "post" && (
        <div className="flex items-center justify-between mb-24">
          <div className="profileImg-small">
            <Image src={gCurUser.photoURL} alt="" fill />
          </div>
          <Textarea
            placeholder={`${gCurUser.displayName}(으)로 댓글 달기...`}
            value={comment}
            onChange={handleChange}
            ref={commentRef}
            autoFocus={router.query.isCommentFocused ? true : false}
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem ",
            }}
          />
          <Button onClick={handleSubmit}>게시</Button>
        </div>
      )} */}
    </>
  );
}
