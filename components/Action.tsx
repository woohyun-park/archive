import React, { forwardRef } from "react";
import { createLike, createScrap } from "../apis/fbCreate";
import { deleteLike, deleteScrap } from "../apis/fbDelete";
import { IPost, IUser } from "../libs/custom";
import BtnIcon from "./atoms/BtnIcon";

interface IActionProps {
  post: IPost;
  curUser: IUser;
  onCommentClick?: () => void;
}

export default forwardRef<HTMLDivElement, IActionProps>(function Action(
  { post, curUser, onCommentClick },
  ref
) {
  const like = curUser.likes?.find((each) => each.pid === post.id);
  const scrap = curUser.scraps?.find((each) => each.pid === post.id);
  const lid = like?.id || "";
  const aid = like?.aid || "";
  const sid = scrap?.id || "";

  async function toggleLike() {
    if (lid === "") createLike(curUser.id, post.uid, post.id || "");
    else deleteLike(lid, aid);
  }

  async function toggleScrap() {
    if (sid === "") createScrap(curUser.id, post.id || "");
    else deleteScrap(sid);
  }

  function displayLike() {
    const len = post.likes?.length;
    if (len === undefined) return 0;
    if (post.likes?.find((each) => each.uid === curUser.id))
      return lid ? len : len - 1;
    else return lid ? len + 1 : len;
  }

  function displayScrap() {
    const len = post.scraps?.length;
    if (len === undefined) return 0;
    if (post.scraps?.find((each) => each.uid === curUser.id))
      return sid ? len : len - 1;
    else return sid ? len + 1 : len;
  }

  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between pt-4 mb-2" ref={ref}>
          <div className="flex">
            <span className="mr-2 hover:cursor-pointer">
              <BtnIcon
                icon="like"
                fill={lid !== "" ? true : false}
                onClick={() => toggleLike()}
              />
            </span>
            <span className="hover:cursor-pointer">
              <BtnIcon icon="comment" onClick={onCommentClick} />
            </span>
          </div>
          <div>
            <span className="hover:cursor-pointer">
              <BtnIcon
                icon="scrap"
                fill={sid !== "" ? true : false}
                onClick={() => toggleScrap()}
              />
            </span>
          </div>
        </div>
        <div className="flex justify-between mb-2 text-xs">
          <div>
            {`좋아요 ${displayLike()}`}
            &nbsp;&nbsp;
            {`댓글 ${post.comments ? post.comments.length : 0}`}
          </div>
          <div>{`스크랩 ${displayScrap()}`}</div>
        </div>
      </div>
    </>
  );
});
