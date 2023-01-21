import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { db } from "../apis/firebase";
import TIME from "../apis/time";
import { useStore } from "../apis/zustand";
import { COLOR, DEFAULT, IComment, IUser } from "../custom";

type ICommentProps = {
  comment: IComment;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Comment({ comment, onClick }: ICommentProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const { gCurUser } = useStore();

  useEffect(() => {
    async function init() {
      const userRef = doc(db, "users", comment.uid);
      const userSnap = await getDoc(userRef);
      const tempUser = { ...(userSnap.data() as IUser) };
      setUser(tempUser);
    }
    init();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center mt-2 mb-1">
          <div className="mr-2 profileImg-small">
            <Image src={user?.photoURL || ""} alt="" fill />
          </div>
          <div>
            <div className="flex items-center">
              <div className="mr-1 text-sm font-bold text-black hover:cursor-pointer">
                {user?.displayName}
              </div>
              <div className="text-xs text-gray-1">
                {TIME.displayCreatedAt(comment.createdAt)}
              </div>
            </div>
            <div className="-mt-1 text-base text-black">{comment?.txt}</div>
          </div>
        </div>
        {user?.id === gCurUser.id ? (
          <div
            className="hover:cursor-pointer"
            onClick={onClick}
            id={comment.id}
          >
            <HiX />
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
