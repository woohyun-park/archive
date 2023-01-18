import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { HiPencil, HiX } from "react-icons/hi";
import {
  db,
  deletePost,
  getDataByQuery,
  getEach,
  updateUser,
} from "../apis/firebase";
import { useStore } from "../apis/zustand";
import {
  COLOR,
  DEFAULT,
  IComment,
  ILike,
  IPost,
  IScrap,
  IStyle,
  ITag,
  IUser,
  SIZE,
} from "../custom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Delete from "./Delete";
import Modify from "./Modify";

type IProfileSmallProps = {
  user: IUser;
  post?: IPost;
  style: IStyle;
};

export default function ProfileSmall({
  user,
  style,
  post,
}: IProfileSmallProps) {
  const { gCurUser } = useStore();
  const [isFollowing, setIsFollowing] = useState(() =>
    gCurUser.followings.find((elem) => elem === user.id) ? true : false
  );
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(
      gCurUser.followings.find((elem) => elem === user.id) ? true : false
    );
  }, [gCurUser]);

  async function handleToggleFollow() {
    const gCurUserRef = doc(db, "users", gCurUser.id);
    const userRef = doc(db, "users", user.id);
    if (isFollowing) {
      await updateDoc(gCurUserRef, { followings: arrayRemove(user.id) });
      await updateDoc(userRef, {
        followers: arrayRemove(gCurUser.id),
      });
    } else {
      await updateDoc(gCurUserRef, {
        followings: arrayUnion(user.id),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(gCurUser.id),
      });
    }
    const tempFollowings = new Set(gCurUser.followings);
    if (isFollowing) {
      tempFollowings.delete(user.id);
    } else {
      tempFollowings.add(user.id);
    }
    const followings = Array.from(tempFollowings) as string[];
    updateUser({ id: gCurUser.id, followings: followings });
    setIsFollowing(!isFollowing);
  }
  function displayCreatedAt() {
    const curDate = dayjs(new Date());
    const postDate = dayjs(post?.createdAt as Date);
    if (curDate.diff(postDate) < 60000) {
      return `${curDate.diff(postDate, "s")}초 전`;
    } else if (curDate.diff(postDate) < 3600000) {
      return `${curDate.diff(postDate, "m")}분 전`;
    } else if (curDate.diff(postDate) < 86400000) {
      return `${curDate.diff(postDate, "h")}시간 전`;
    } else if (curDate.diff(postDate) < 86400000 * 3) {
      return `${curDate.diff(postDate, "d")}일 전`;
    } else {
      return postDate.format("MM월 DD, YYYY");
    }
  }

  return (
    <>
      <div className={`userCont userCont-${style}`}>
        <div className={user.id === gCurUser.id ? "row row-cur" : "row"}>
          <Link href={`/profile/${user?.id}`}>
            <div className="g-profileImg">
              <Image src={user?.photoURL} alt={DEFAULT.img.alt} fill />
            </div>
          </Link>
          <div className="col">
            <Link href={`/profile/${user?.id}`} legacyBehavior>
              <a className="userName">{user?.displayName}</a>
            </Link>
            {style === "feed" || style === "post" ? (
              <div className="createdAt">{displayCreatedAt()}</div>
            ) : (
              <div className="txt">{user.txt}</div>
            )}
          </div>
        </div>
        {(() => {
          // TODO: 분기 확인해서 변경할것
          if (style === "post" || style === "search") {
            if (gCurUser.id === user.id) {
              return <></>;
            } else if (isFollowing) {
              return (
                <div className="followBtn" onClick={handleToggleFollow}>
                  팔로잉
                </div>
              );
            } else {
              return (
                <div
                  className="followBtn followBtn-follow"
                  onClick={handleToggleFollow}
                >
                  팔로우
                </div>
              );
            }
          } else if (user.id === gCurUser.id) {
            return (
              <>
                <div className="actionCont">
                  <Modify post={post} />
                  <Delete id={post?.id || ""} />
                </div>
              </>
            );
          } else {
            return <div></div>;
          }
        })()}
      </div>

      <style jsx>
        {`
          .userCont {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .userCont-post,
          .userCont-feed {
            margin: 32px 0 8px 0;
          }
          .userCont-search {
            margin: 4px 0 12px 0;
          }
          .userName {
            font-size: 16px;
            text-decoration: none;
            color: ${COLOR.txt1};
          }
          .createdAt {
            font-size: 12px;
            color: ${COLOR.txt2};
          }
          .txt {
            font-size: 12px;
            color: ${COLOR.txt2};
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre-wrap;
            width: 100%;
          }
          .row {
            display: flex;
            flex-direction: row;
            width: calc(100% - 48px);
          }
          .row-cur {
            width: calc(100% - 18px);
          }
          .col {
            display: flex;
            flex-direction: column;
            width: inherit;
          }
          .followBtn {
            padding: 8px 12px;
            background-color: ${COLOR.bg2};
            color: ${COLOR.txt2};
            font-size: 12px;
            border-radius: 4px;
          }
          .followBtn-follow {
            background-color: ${COLOR.bgDark1};
            color: ${COLOR.txtDark1};
          }
          .moreBtn,
          .followBtn {
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .actionCont {
            display: flex;
          }
          .userImg:hover,
          .userName:hover,
          .followBtn:hover,
          .moreBtn:hover,
          .svg:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
