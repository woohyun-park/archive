import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiDotsHorizontal } from "react-icons/hi";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IDict, IPost, IStyle, IUser, SIZE } from "../custom";
import dayjs from "dayjs";

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

  async function handleFollow() {
    const tempCurUserFollowings = {
      ...(curUser.followings as IDict<boolean>),
      [user.uid]: !curUser.followings[user.uid],
    };
    const tempCurUser = { ...curUser, followings: tempCurUserFollowings };
    setCurUser(tempCurUser);
    updateCurUser(tempCurUser);

    const userRef = doc(db, "users", user.uid);
    const tempUserFollowers = {
      ...(user?.followers as IDict<boolean>),
      [curUser.uid]: !user?.followers[curUser.uid],
    };
    const tempUser = { ...user, followers: tempUserFollowers };
    await updateDoc(userRef, tempUser);
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
  function displayTxt() {
    return user.txt;
  }

  return (
    <>
      <div className={`userCont userCont-${style}`}>
        <div className={user.uid === curUser.uid ? "row row-cur" : "row"}>
          <Link href={`/profile/${user?.uid}`}>
            {/* <div className="overlay"></div> */}
            <img className="userImg" src={user?.photoURL} />
          </Link>
          <div className="col">
            <Link href={`/profile/${user?.uid}`} legacyBehavior>
              <a className="userName">{user?.displayName}</a>
            </Link>
            {style === "feed" ? (
              <div className="createdAt">{displayCreatedAt()}</div>
            ) : (
              <div className="txt">{displayTxt()}</div>
            )}
          </div>
        </div>
        {(() => {
          if (style === "post" || style === "search") {
            if (curUser.uid === user.uid) {
              return <></>;
            } else if (curUser.followings[user.uid]) {
              return (
                <div className="followBtn" onClick={handleFollow}>
                  팔로잉
                </div>
              );
            } else {
              return (
                <div
                  className="followBtn followBtn-follow"
                  onClick={handleFollow}
                >
                  팔로우
                </div>
              );
            }
          } else {
            return (
              <>
                <div className="moreBtn">
                  <HiDotsHorizontal size={SIZE.iconSmall} />
                </div>
              </>
            );
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
          .userImg {
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 8px;
          }
           {
            /* .overlay {
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            background-color: rgba(0, 0, 0, 0.1);
          } */
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
          .userImg,
          .userName,
          .followBtn:hover,
          .moreBtn:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
