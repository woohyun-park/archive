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

type IActionType = "likes" | "scraps";

export default forwardRef<HTMLDivElement, IActionProps>(function Action(
  { post, curUser, onCommentClick },
  ref
) {
  const [status, setStatus] = useState<IDict<string>>({ ...calcStatus() });

  useEffect(() => {
    setStatus({ ...calcStatus() });
  }, [curUser.likes, curUser.scraps]);

  function calcStatus() {
    const likes = curUser.likes?.find((each) => each.pid === post.id);
    const scraps = curUser.scraps?.find((each) => each.pid === post.id);
    return {
      likes: likes ? (likes.id as string) : "",
      scraps: scraps ? (scraps.id as string) : "",
    };
  }

  async function handleToggle(type: IActionType) {
    if (status[type]) {
      await deleteDoc(doc(db, type, status[type]));
    } else {
      const newData: IDict<string> = {
        uid: curUser.id,
        pid: post.id || "",
      };
      type === "scraps" ? (newData.cont = "모든 스크랩") : void 0;
      const ref = await addDoc(collection(db, type), newData);
      await updateDoc(ref, { id: ref.id });
    }
  }

  function displayStatus(type: IActionType) {
    const len = post[type]?.length;
    if (len === undefined) return 0;
    if (post[type]?.find((each) => each.uid === curUser.id))
      return status[type] ? len : len - 1;
    else return status[type] ? len + 1 : len;
  }

  return (
    <>
      <div className="flex justify-between pt-4 mb-2" ref={ref}>
        <div className="flex">
          <span className="mr-2 hover:cursor-pointer">
            <IconBtn
              type="like"
              fill={status.likes !== "" ? true : false}
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
              fill={status.scraps !== "" ? true : false}
              onClick={() => handleToggle("scraps")}
            />
          </span>
        </div>
      </div>
      <div className="flex justify-between mb-2 text-xs">
        <div>
          {`좋아요 ${displayStatus("likes")}`}
          &nbsp;&nbsp;
          {`댓글 ${post.comments?.length}`}
        </div>
        <div>{`스크랩 ${displayStatus("scraps")}`}</div>
      </div>
    </>
  );
});
