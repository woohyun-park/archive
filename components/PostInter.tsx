import { useState } from "react";
import { IconBase } from "react-icons";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiHeart,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";
import { IPost, IUser, SIZE } from "../custom";
import Image from "./Image";
import ProfileSmall from "./ProfileSmall";

type IPostInterProps = {
  post: IPost;
  user: IUser;
};

export default function PostInter({ post, user }: IPostInterProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isScraped, setIsScraped] = useState(false);
  function handleToggleHeart() {
    console.log("handleToggleHeart");
    // const tempCurUserLikes
  }

  //   async function handleFollow() {
  //     const tempCurUserFollowings = {
  //       ...(curUser.followings as IDict<boolean>),
  //       [user.uid]: !curUser.followings[user.uid],
  //     };
  //     const tempCurUser = { ...curUser, followings: tempCurUserFollowings };
  //     setCurUser(tempCurUser);
  //     updateCurUser(tempCurUser);

  //     const userRef = doc(db, "users", user.uid);
  //     const tempUserFollowers = {
  //       ...(user?.followers as IDict<boolean>),
  //       [curUser.uid]: !user?.followers[curUser.uid],
  //     };
  //     const tempUser = { ...user, followers: tempUserFollowers };
  //     await updateDoc(userRef, tempUser);
  //   }

  return (
    <>
      <div className="cont">
        <div>
          <span className="heart">
            {isLiked ? (
              <HiHeart size={SIZE.icon} onClick={handleToggleHeart} />
            ) : (
              <HiOutlineHeart size={SIZE.icon} onClick={handleToggleHeart} />
            )}
          </span>
          <span>
            <HiOutlineChatBubbleOvalLeft size={SIZE.icon} />
          </span>
        </div>
        <div>
          <span>
            {isScraped ? (
              <HiBookmark size={SIZE.icon} />
            ) : (
              <HiOutlineBookmark size={SIZE.icon} />
            )}
          </span>
        </div>
      </div>
      <style jsx>
        {`
          .cont {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
          }
          .heart {
            margin-right: 8px;
          }
          span:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
