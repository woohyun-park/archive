import Image from "next/image";
import { useRouter } from "next/router";
import { IAlarm } from "../libs/custom";
import { displayCreatedAt } from "../libs/timeLib";
import ProfileImg from "./ProfileImg";

type IAlarmLikeProps = {
  alarm: IAlarm;
};

export default function AlarmLike({ alarm }: IAlarmLikeProps) {
  const router = useRouter();
  return (
    <>
      <div
        className={
          alarm.isViewed
            ? "flex justify-between px-4 py-2"
            : "flex justify-between px-4 py-2 bg-gray-3"
        }
      >
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
                {"님이 회원님의 게시물을 좋아합니다"}
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
