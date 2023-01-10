import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { IconBase } from "react-icons";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiHeart,
  HiOutlineHeart,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { IPost, IUser, SIZE } from "../custom";

type IPostActionProps = {
  post: IPost;
  user: IUser;
};

export default function PostAction({ post, user }: IPostActionProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [isLiked, setIsLiked] = useState(
    curUser.likes.find((elem) => elem === post.id) ? true : false
  );
  const [isScraped, setIsScraped] = useState(
    curUser.scraps.find((elem) => elem === post.id) ? true : false
  );

  async function handleToggleLike() {
    const postRef = doc(db, "posts", post.id);
    const res = await updateDoc(postRef, {
      likes: arrayUnion(curUser.uid),
    });

    const tempCurUserLikes = {
      ...curUser.likes,
      [post.id]: !user.likes[post.id],
    };
    setCurUser({ ...curUser, likes: tempCurUserLikes });
    updateCurUser({ ...curUser, likes: tempCurUserLikes });

    setIsLiked(!isLiked);
  }

  async function handleToggleScrap() {
    const postRef = doc(db, "posts", post.id);
    const tempPostScraped = {
      ...post.scraps,
      [curUser.uid]: !post.scraps[curUser.uid],
    };
    await updateDoc(postRef, { ...post, scraps: tempPostScraped });

    const tempCurUserScraps = {
      ...curUser.scraps,
      [post.id]: !user.scraps[post.id],
    };
    setCurUser({ ...curUser, scraps: tempCurUserScraps });
    updateCurUser({ ...curUser, scraps: tempCurUserScraps });

    setIsScraped(!isScraped);
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
              <HiHeart size={SIZE.icon} onClick={handleToggleLike} />
            ) : (
              <HiOutlineHeart size={SIZE.icon} onClick={handleToggleLike} />
            )}
          </span>
          <span>
            <HiOutlineChatBubbleOvalLeft size={SIZE.icon} />
          </span>
        </div>
        <div>
          <span>
            {isScraped ? (
              <HiBookmark onClick={handleToggleScrap} size={SIZE.icon} />
            ) : (
              <HiOutlineBookmark onClick={handleToggleScrap} size={SIZE.icon} />
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
