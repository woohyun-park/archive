import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IComment, IPost, IUser } from "../custom";
import Image from "./Image";
import PostAction from "./PostAction";
import ProfileSmall from "./ProfileSmall";

type ICommentProps = {
  id: string;
  onClick: (e: React.MouseEvent<SVGElement>) => void;
};

export default function Comment({ id, onClick }: ICommentProps) {
  const [comment, setComment] = useState<IComment | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const { curUser, setCurUser, updateCurUser } = useStore();

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const commentRef = doc(db, "comments", id);
    const commentSnap = await getDoc(commentRef);
    const tempComment = { ...(commentSnap.data() as IComment) };
    setComment(tempComment);
    const userRef = doc(db, "users", tempComment.uid);
    const userSnap = await getDoc(userRef);
    const tempUser = { ...(userSnap.data() as IUser) };
    setUser(tempUser);
  }

  return (
    <>
      <div className="cont">
        <div className="leftCont">
          <img className="g-profileImg" src={user?.photoURL} />
          <div>
            <div className="displayName">{user?.displayName}</div>
            <div className="txt">{comment?.txt}</div>
          </div>
        </div>
        {user?.uid === curUser.uid ? <HiX onClick={onClick} id={id} /> : <></>}
      </div>

      <style jsx>
        {`
          .cont {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .leftCont {
            display: flex;
            align-items: center;
            margin-top: 8px;
            margin-bottom: 4px;
          }
          .displayName {
            font-size: 12px;
            font-weight: bold;
            color: ${COLOR.txt3};
          }
          .txt {
            font-size: 16px;
          }
        `}
      </style>
    </>
  );
}
