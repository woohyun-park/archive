import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { HiPencil, HiX } from "react-icons/hi";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, DEFAULT, IPost, IStyle, IUser, SIZE } from "../custom";
import dayjs from "dayjs";
import { useState } from "react";

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
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem) => elem === user.uid) ? true : false
  );

  async function handleToggleFollow() {
    const curUserRef = doc(db, "users", curUser.uid);
    const userRef = doc(db, "users", user.uid);
    if (isFollowing) {
      await updateDoc(curUserRef, { followings: arrayRemove(user.uid) });
      await updateDoc(userRef, {
        followers: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(curUserRef, {
        followings: arrayUnion(user.uid),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(curUser.uid),
      });
    }
    const tempFollowings = new Set(curUser.followings);
    if (isFollowing) {
      tempFollowings.delete(user.uid);
    } else {
      tempFollowings.add(user.uid);
    }
    const followings = Array.from(tempFollowings) as string[];
    setCurUser({ ...curUser, followings });
    updateCurUser({ ...curUser, followings });
    setIsFollowing(!isFollowing);
  }
  function displayCreatedAt() {
    const curDate = dayjs(new Date());
    const postDate = dayjs(post?.createdAt);
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
  function handleModify() {}
  async function handleDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      await updateDoc(doc(db, "posts", post?.id || ""), {
        ...DEFAULT.postDeleted,
        id: post?.id,
      });
    }
  }

  return (
    <>
      <div className={`userCont userCont-${style}`}>
        <div className={user.uid === curUser.uid ? "row row-cur" : "row"}>
          <Link href={`/profile/${user?.uid}`}>
            <img className="g-profileImg" src={user?.photoURL} />
          </Link>
          <div className="col">
            <Link href={`/profile/${user?.uid}`} legacyBehavior>
              <a className="userName">{user?.displayName}</a>
            </Link>
            {style === "feed" ? (
              <div className="createdAt">{displayCreatedAt()}</div>
            ) : (
              <div className="txt">{user.txt}</div>
            )}
          </div>
        </div>
        {(() => {
          if (style === "post" || style === "search") {
            if (curUser.uid === user.uid) {
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
          } else if (user.uid === curUser.uid) {
            return (
              <>
                <div className="actionCont">
                  <div className="svg" onClick={handleModify}>
                    <HiPencil size={SIZE.iconSmall} />
                  </div>
                  <div className="svg" onClick={handleDelete}>
                    <HiX size={SIZE.iconSmall} />
                  </div>
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
            white-space: nowrap;
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
