import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState, forwardRef } from "react";
import { db } from "../apis/firebase";
import { IPost, IUser, IDict } from "../libs/custom";
import IconBtn from "./atoms/IconBtn";

interface IActionProps {
  post: IPost;
  curUser: IUser;
  onCommentClick?: () => void;
}

export default forwardRef<HTMLDivElement, IActionProps>(function Action(
  { post, curUser, onCommentClick },
  ref
) {
  const [status, setStatus] = useState({
    ...calcLikeAndScrapStatus(),
  });

  useEffect(() => {
    setStatus({
      ...calcLikeAndScrapStatus(),
    });
  }, [curUser.likes, curUser.scraps]);

  function calcLikeAndScrapStatus() {
    return {
      likes: curUser.likes?.find((each) => each.pid === post.id) ? true : false,
      lid: curUser.likes?.find((each) => each.pid === post.id)?.id || "",
      scraps: curUser.scraps?.find((each) => each.pid === post.id)
        ? true
        : false,
      sid: curUser.scraps?.find((each) => each.pid === post.id)?.id || "",
    };
  }

  async function handleToggle(type: "likes" | "scraps") {
    if (status[type]) {
      await deleteDoc(
        doc(
          db,
          type,
          type === "likes" ? status.lid : type === "scraps" ? status.sid : ""
        )
      );
    } else {
      const newData: IDict<string> = {
        uid: curUser.id,
        pid: post.id || "",
      };
      type === "scraps" ? (newData.cont = "모든 스크랩") : void 0;
      const ref = await addDoc(collection(db, type), newData);
      await updateDoc(ref, {
        id: ref.id,
      });
    }
  }

  function displayLikeAndScrap(type: "likes" | "scraps") {
    const len = post[type]?.length;
    if (len === undefined) return 0;
    if (post[type]?.find((each) => each.uid === curUser.id)) {
      if (status[type]) {
        return len;
      } else {
        return len - 1;
      }
    } else {
      if (status[type]) {
        return len + 1;
      } else {
        return len;
      }
    }
  }

  return (
    <>
      <div className="flex justify-between pt-4 mb-2" ref={ref}>
        <div className="flex">
          <span className="mr-2 hover:cursor-pointer">
            <IconBtn
              type="like"
              fill={status.likes}
              onClick={() => handleToggle("likes")}
            />
          </span>
          <span className="hover:cursor-pointer">
            <IconBtn type="comment" onClick={onCommentClick} />
          </span>
        </div>
        <div>
          <span className="hover:cursor-pointer">
            <IconBtn
              type="scrap"
              fill={status.scraps}
              onClick={() => handleToggle("scraps")}
            />
          </span>
        </div>
      </div>
      <div className="flex justify-between mb-2 text-xs">
        <div>
          {`좋아요 ${displayLikeAndScrap("likes")}`}
          &nbsp;&nbsp;
          {`댓글 ${post.comments?.length}`}
        </div>
        <div>{`스크랩 ${displayLikeAndScrap("scraps")}`}</div>
      </div>
    </>
  );
});
