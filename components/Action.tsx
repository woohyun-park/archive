import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState, forwardRef } from "react";
import { db } from "../apis/firebase";
import { IPost, IUser, IDict, IAlarm } from "../libs/custom";
import { usePost } from "../stores/usePost";
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
  const { comments } = usePost();
  const comment = comments[post.id || ""];

  useEffect(() => {
    setStatus({ ...calcStatus() });
  }, [curUser.likes, curUser.scraps]);

  function calcStatus() {
    const likes = curUser.likes?.find((each) => each.pid === post.id);
    const scraps = curUser.scraps?.find((each) => each.pid === post.id);
    return {
      likes: likes ? (likes.id as string) : "",
      likesAlarm: likes ? likes.aid : "",
      scraps: scraps ? (scraps.id as string) : "",
    };
  }

  async function handleToggle(type: IActionType) {
    if (status[type]) {
      await deleteDoc(doc(db, type, status[type]));
      if (type === "likes") {
        await deleteDoc(doc(db, "alarms", status["likesAlarm"]));
      }
    } else {
      const newData: IDict<string> = {
        uid: curUser.id,
        pid: post.id || "",
      };
      if (type === "scraps") {
        newData.cont = "모든 스크랩";
      } else if (type === "likes") {
        const newAlarm: IAlarm = {
          uid: curUser.id,
          type: "like",
          targetUid: post.uid,
          targetPid: post.id || "",
          createdAt: new Date(),
        };
        const ref = await addDoc(collection(db, "alarms"), newAlarm);
        await updateDoc(ref, { id: ref.id });
        newData.aid = ref.id;
      }
      const ref = await addDoc(collection(db, type), newData);
      await updateDoc(ref, { id: ref.id });
    }
  }

  function displayLikes() {
    const len = post.likes?.length;
    if (len === undefined) return 0;
    if (post.likes?.find((each) => each.uid === curUser.id))
      return status.likes ? len : len - 1;
    else return status.likes ? len + 1 : len;
  }
  function displayScraps() {
    const len = post.scraps?.length;
    if (len === undefined) return 0;
    if (post.scraps?.find((each) => each.uid === curUser.id))
      return status.scraps ? len : len - 1;
    else return status.scraps ? len + 1 : len;
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between pt-4 mb-2" ref={ref}>
          <div className="flex">
            <span className="mr-2 hover:cursor-pointer">
              <IconBtn
                icon="like"
                fill={status.likes !== "" ? true : false}
                onClick={() => handleToggle("likes")}
              />
            </span>
            <span className="hover:cursor-pointer">
              <IconBtn icon="comment" onClick={onCommentClick} />
            </span>
          </div>
          <div>
            <span className="hover:cursor-pointer">
              <IconBtn
                icon="scrap"
                fill={status.scraps !== "" ? true : false}
                onClick={() => handleToggle("scraps")}
              />
            </span>
          </div>
        </div>
        <div className="flex justify-between mb-2 text-xs">
          <div>
            {`좋아요 ${displayLikes()}`}
            &nbsp;&nbsp;
            {`댓글 ${comment ? comment.length : 0}`}
          </div>
          <div>{`스크랩 ${displayScraps()}`}</div>
        </div>
      </div>
    </>
  );
});
