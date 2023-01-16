import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { HiPencil, HiX } from "react-icons/hi";
import { db, getDataByQuery } from "../apis/firebase";
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
import { useState } from "react";
import Router, { useRouter } from "next/router";

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
  const { curUser, setCurUser } = useStore();
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem) => elem === user.id) ? true : false
  );
  const router = useRouter();

  async function handleToggleFollow() {
    const curUserRef = doc(db, "users", curUser.id);
    const userRef = doc(db, "users", user.id);
    if (isFollowing) {
      await updateDoc(curUserRef, { followings: arrayRemove(user.id) });
      await updateDoc(userRef, {
        followers: arrayRemove(curUser.id),
      });
    } else {
      await updateDoc(curUserRef, {
        followings: arrayUnion(user.id),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(curUser.id),
      });
    }
    const tempFollowings = new Set(curUser.followings);
    if (isFollowing) {
      tempFollowings.delete(user.id);
    } else {
      tempFollowings.add(user.id);
    }
    const followings = Array.from(tempFollowings) as string[];
    setCurUser({ id: curUser.id, followings: followings });
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
  function handleModify() {
    router.push(
      {
        pathname: "/add",
        query: { post: JSON.stringify(post) },
      },
      "/modify"
    );
  }
  async function handleDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      const id = post?.id as string;
      await deleteDoc(doc(db, "posts", id));
      const likes = await getDataByQuery<ILike>("likes", "pid", "==", id);
      const scraps = await getDataByQuery<IScrap>("scraps", "pid", "==", id);
      const comments = await getDataByQuery<IComment>(
        "comments",
        "pid",
        "==",
        id
      );
      const tags = await getDataByQuery<ITag>("tags", "pid", "==", id);
      for await (const each of likes) {
        const id = each.id as string;
        await deleteDoc(doc(db, "likes", id));
      }
      for await (const each of scraps) {
        const id = each.id as string;
        await deleteDoc(doc(db, "scraps", id));
      }
      for await (const each of comments) {
        const id = each.id as string;
        await deleteDoc(doc(db, "comments", id));
      }
      for await (const each of tags) {
        const id = each.id as string;
        await deleteDoc(doc(db, "tags", id));
      }
      alert("삭제되었습니다");
    } else {
      console.log(post);
    }
    router.push("/");
  }

  return (
    <>
      <div className={`userCont userCont-${style}`}>
        <div className={user.id === curUser.id ? "row row-cur" : "row"}>
          <Link href={`/profile/${user?.id}`}>
            <img
              className="g-profileImg"
              src={user?.photoURL}
              alt={DEFAULT.img.alt}
            />
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
          if (style === "post" || style === "search") {
            if (curUser.id === user.id) {
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
          } else if (user.id === curUser.id) {
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
