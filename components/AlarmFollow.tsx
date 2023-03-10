import { useRouter } from "next/router";
import { useState } from "react";
import { updateFollow } from "../apis/fbUpdate";
import { IAlarm } from "../libs/custom";
import { displayCreatedAt } from "../libs/timeLib";
import { useUser } from "../stores/useUser";
import Btn from "./atoms/Btn";
import ProfileImg from "./ProfileImg";

type IAlarmFollowProps = {
  alarm: IAlarm;
};

export default function AlarmFollow({ alarm }: IAlarmFollowProps) {
  const router = useRouter();
  const { curUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem: string) => elem === alarm.uid) ? true : false
  );
  async function handleToggleFollow() {
    if (alarm.author) {
      await updateFollow(curUser, alarm.author, isFollowing);
      setIsFollowing(!isFollowing);
    }
  }
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
                {"님이 회원님을 팔로우하기 시작했습니다"}
              </span>
              <span className="inline-block text-xs break-keep text-gray-2">
                {displayCreatedAt(alarm.createdAt)}
              </span>
            </div>
          </div>
          <Btn
            label={isFollowing ? "팔로잉" : "팔로우"}
            onClick={handleToggleFollow}
            isActive={!isFollowing}
            size="sm"
          />
        </div>
      </div>
    </>
  );
}
