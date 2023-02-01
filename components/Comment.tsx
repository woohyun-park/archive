import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { db } from "../apis/firebase";
import { useStore } from "../stores/useStore";
import { IComment, IUser } from "../libs/custom";
import Motion from "../motions/Motion";
import { displayCreatedAt } from "../libs/timeLib";
import { useUser } from "../stores/useUser";

type ICommentProps = {
  comment: IComment;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Comment({ comment, onClick }: ICommentProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const { curUser } = useUser();

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
      <Motion type="float">
        <div className="flex items-end justify-between my-1">
          <div className="flex items-center mt-2 mb-1">
            <div className="mt-1 mr-2 profileImg-small self-baseline">
              <Image src={user?.photoURL || ""} alt="" fill />
            </div>
            <div>
              <div className="flex items-center">
                <div className="mr-1 text-sm font-bold text-black hover:cursor-pointer">
                  {user?.displayName}
                </div>
                <div className="text-xs text-gray-1">
                  {displayCreatedAt(comment.createdAt)}
                </div>
              </div>
              <div className="-mt-1 text-base leading-5 text-black break-all">
                {comment?.txt}
              </div>
            </div>
          </div>
          {user?.id === curUser.id ? (
            <div
              className="mx-2 mt-5 hover:cursor-pointer self-baseline"
              onClick={onClick}
              id={comment.id}
            >
              <HiX />
            </div>
          ) : (
            <></>
          )}
        </div>
      </Motion>
    </>
  );
}
