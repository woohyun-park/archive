import Image from "next/image";
import useCustomRouter from "../hooks/useCustomRouter";
import { IAlarm } from "../libs/custom";
import { displayCreatedAt } from "../libs/timeLib";
import ProfileImg from "./ProfileImg";

type IAlarmCommentProps = {
  alarm: IAlarm;
};

export default function AlarmComment({ alarm }: IAlarmCommentProps) {
  const router = useCustomRouter();
  return (
    <>
      <div className="flex justify-between my-2">
        <div className="flex">
          <ProfileImg
            size="sm"
            photoURL={alarm.author?.photoURL || ""}
            onClick={() => router.push(`/profile/${alarm.author?.id}`)}
          />
          <div className="flex items-center min-h-[2rem] ml-1">
            <div className="text-sm leading-[0.875rem] mt-[0.25rem]">
              <span
                className="font-bold hover:cursor-pointer"
                onClick={() => router.push(`/profile/${alarm.author?.id}`)}
              >
                {alarm.author?.displayName}
              </span>
              <span className="mr-1">
                {`님이 회원님의 게시물에 댓글을 남겼습니다: ${alarm.comment?.txt}`}
              </span>
              <span className="inline-block text-xs break-keep text-gray-2">
                {displayCreatedAt(alarm.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {alarm.post?.imgs.length !== 0 ? (
          <div
            className="relative w-8 h-8 pb-8 overflow-hidden duration-500 rounded-sm min-w-[2rem] min-h-[2rem] hover:cursor-pointer"
            onClick={() => router.push(`/post/${alarm.post?.id}`)}
          >
            <Image
              className="object-cover bg-transparent"
              src={alarm.post?.imgs[0] || ""}
              alt=""
              fill
            />
          </div>
        ) : (
          <div
            className="relative w-8 h-8 pb-8 overflow-hidden duration-500 rounded-sm min-w-[2rem] min-h-[2rem] hover:cursor-pointer"
            style={{ backgroundColor: alarm.post.color }}
            onClick={() => router.push(`/post/${alarm.post?.id}`)}
          ></div>
        )}
      </div>
    </>
  );
}
