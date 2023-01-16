import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, DEFAULT, IComment, IUser } from "../custom";

type ICommentProps = {
  comment: IComment;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Comment({ comment, onClick }: ICommentProps) {
  // const [comment, setComment] = useState<IComment | null>(null);
  console.log(comment);
  const [user, setUser] = useState<IUser | null>(null);
  const { curUser } = useStore();

  useEffect(() => {
    async function init() {
      // 만약 user를 cache해놓고 cache hit일때는 바로 가져오도록 하면 더 빠르지 않을까
      const userRef = doc(db, "users", comment.uid);
      const userSnap = await getDoc(userRef);
      const tempUser = { ...(userSnap.data() as IUser) };
      setUser(tempUser);
    }
    init();
  }, []);

  return (
    <>
      <div className="cont">
        <div className="leftCont">
          <img
            className="g-profileImg"
            src={user?.photoURL || ""}
            alt={DEFAULT.img.alt}
          />
          <div>
            <div className="displayName">{user?.displayName}</div>
            <div className="txt">{comment?.txt}</div>
          </div>
        </div>
        {user?.id === curUser.id ? (
          <div onClick={onClick} id={comment.id}>
            <HiX />
          </div>
        ) : (
          <></>
        )}
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
