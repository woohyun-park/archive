import { collection, doc, getDoc, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { db } from "../apis/firebase";
import { COLOR, IPost, SIZE } from "../custom";

type IProfileSmallProps = {
  post: IPost | null;
};

export default function ProfileSmall({ post }: IProfileSmallProps) {
  const [profile, setProfile] = useState({ displayName: "", photoURL: "" });
  async function getProfile() {
    if (post?.uid) {
      const snap = await getDoc(doc(db, "users", post.uid));
      if (snap.exists()) {
        const profile = snap.data();
        setProfile({
          displayName: snap.data().displayName,
          photoURL: snap.data().photoURL,
        });
      } else {
        console.log("No such doc");
      }
    }
  }
  useEffect(() => {
    getProfile();
  }, []);
  const router = useRouter();
  return (
    <>
      <div className="userCont">
        <div className="row">
          <img className="userImg" src={profile.photoURL} />
          <div className="col">
            <div className="userName">{profile.displayName}</div>
            <div className="createdAt">{post?.createdAt}</div>
          </div>
        </div>
        {post && router.pathname.split("/")[1] === "post" ? (
          <div className="followBtn">팔로우</div>
        ) : (
          <div className="moreBtn">
            <HiDotsHorizontal size={SIZE.icon} />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .userCont {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 32px 0 8px 0;
          }
          .userImg {
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 8px;
          }
          .userName {
            font-size: 16px;
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
            background-color: ${COLOR.txt3};
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
