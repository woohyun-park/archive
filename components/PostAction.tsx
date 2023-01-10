import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
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
    const postRef = doc(db, "posts", post.id || "");
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(curUser.uid),
      });
    }

    const tempLikes = new Set(curUser.likes);
    if (isLiked) {
      tempLikes.delete(post.id || "");
    } else {
      tempLikes.add(post.id || "");
    }
    const likes = Array.from(tempLikes) as string[];
    setCurUser({ ...curUser, likes });
    updateCurUser({ ...curUser, likes });

    setIsLiked(!isLiked);
  }

  async function handleToggleScrap() {
    const postRef = doc(db, "posts", post.id || "");
    if (isScraped) {
      await updateDoc(postRef, {
        scraps: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        scraps: arrayUnion(curUser.uid),
      });
    }

    const tempScraps = new Set(curUser.scraps);
    if (isScraped) {
      tempScraps.delete(post.id || "");
    } else {
      tempScraps.add(post.id || "");
    }
    const scraps = Array.from(tempScraps) as string[];
    setCurUser({ ...curUser, scraps });
    updateCurUser({ ...curUser, scraps });

    setIsScraped(!isScraped);
  }

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
