import { collection, doc, getDoc, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IPost, IUser, SIZE } from "../custom";

type IProfileSmallProps = {
  user: IUser;
  post?: IPost;
  style: string;
};

export default function ProfileSmall({
  user,
  style,
  post,
}: IProfileSmallProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const router = useRouter();
  // const [profile, setProfile] = useState({});
  // async function getProfile() {
  //   if (post?.uid) {
  //     const snap = await getDoc(doc(db, "users", post.uid));
  //     if (snap.exists()) {
  //       setProfile({
  //         displayName: snap.data().displayName,
  //         photoURL: snap.data().photoURL,
  //       });
  //     } else {
  //       console.log("No such doc");
  //     }
  //   }
  // }
  // useEffect(() => {
  //   getProfile();
  // }, [post]);
  return (
    <>
      <div
        className={
          style === "post"
            ? "userCont userCont-post"
            : style === "search"
            ? "userCont userCont-search"
            : style === "feed"
            ? "userCont userCont-feed"
            : "userCont"
        }
      >
        <div className="row">
          <Link href={`/profile/${user?.uid}`}>
            <img className="userImg" src={user?.photoURL} />
          </Link>
          <div className="col">
            <Link href={`/profile/${user?.uid}`} legacyBehavior>
              <a className="userName">{user?.displayName}</a>
            </Link>
            <div className="createdAt">{post?.createdAt}</div>
          </div>
        </div>
        {(() => {
          const result = [];
          if (style === "post" || style === "search") {
            if (curUser.uid === user.uid) {
              result.push(<></>);
            } else {
              result.push(<div className="followBtn">팔로우</div>);
            }
          } else {
            result.push(
              <div className="moreBtn">
                <HiDotsHorizontal size={SIZE.iconSmall} />
              </div>
            );
          }
          return result;
        })()}
      </div>
      <style jsx>
        {`
          .userCont {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
          .userName {
            font-size: 16px;
            text-decoration: none;
            color: ${COLOR.txt1};
          }
          .createdAt {
            font-size: 12px;
            color: ${COLOR.txt2};
          }
          .row {
            display: flex;
            flex-direction: row;
          }
          .col {
            display: flex;
            flex-direction: column;
          }
          .followBtn {
            padding: 8px 12px;
            background-color: ${COLOR.bg2};
            color: ${COLOR.txt2};
            font-size: 12px;
            border-radius: 4px;
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
