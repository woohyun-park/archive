import { HiX } from "react-icons/hi";
import { IComment } from "../apis/def";
import ProfileImg from "./ProfileImg";
import WrapMotionFloat from "./wrappers/motion/WrapMotionFloat";
import { displayCreatedAt } from "../apis/time";
import { readUser } from "apis/firebase";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useUser } from "providers";

type ICommentProps = {
  comment: IComment;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

export default function Comment({ comment, onClick }: ICommentProps) {
  const router = useRouter();
  const { data: curUser } = useUser();
  const { data: user } = useQuery({
    queryKey: [`users/${comment.uid}`],
    queryFn: () => readUser(comment.uid),
  });

  return (
    <>
      <WrapMotionFloat>
        <div className="flex items-end justify-between my-1">
          <div className="flex items-center mt-2 mb-1">
            <ProfileImg
              size="sm"
              photoURL={user?.photoURL || ""}
              onClick={() => router.push(`/profile/${user?.id}`)}
            />
            <div className="ml-1">
              <div className="flex items-center">
                <div className="mr-1 text-sm font-bold text-black hover:cursor-pointer">
                  {user?.displayName}
                </div>
                <div className="text-xs text-gray-1">
                  {displayCreatedAt(comment.createdAt)}
                </div>
              </div>
              <div className="-mt-[0.125rem] text-base leading-5 text-black break-all">
                {comment?.txt}
              </div>
            </div>
          </div>
          {user?.id === curUser.id && (
            <div
              className="mx-2 mt-5 hover:cursor-pointer self-baseline"
              onClick={onClick}
              id={comment.id}
            >
              <HiX />
            </div>
          )}
        </div>
      </WrapMotionFloat>
    </>
  );
}
