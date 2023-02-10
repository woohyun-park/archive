import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IconBtn from "../components/atoms/IconBtn";
import { getDatasByQuery, db, getData } from "../apis/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useUser } from "../stores/useUser";
import { IAlarm, IPost, IUser } from "../libs/custom";
import ProfileImg from "../components/atoms/ProfileImg";
import { displayCreatedAt } from "../libs/timeLib";
import Image from "next/image";

export default function Alarm() {
  const [alarms, setAlarms] = useState<IAlarm[]>([]);
  const { curUser } = useUser();
  useEffect(() => {
    async function init() {
      const res: IAlarm[] = await getDatasByQuery(
        query(
          collection(db, "alarms"),
          where("targetUid", "==", curUser.id),
          orderBy("createdAt", "desc")
        )
      );
      for await (const alarm of res) {
        if (alarm.type === "like") {
          const author = await getData<IUser>("users", alarm.uid);
          const post = await getData<IPost>("posts", alarm.targetPid || "");

          alarm.author = author;
          alarm.post = post;
        }
      }
      setAlarms(res);
    }
    init();
  }, []);
  const router = useRouter();
  return (
    <>
      <div className="flex my-2">
        <IconBtn icon="back" onClick={() => router.back()} />
        <div className="title-page">알림</div>
      </div>
      <div className="mt-4">
        {alarms.map((e) => (
          <>
            {e.type === "like" && (
              <div className="flex justify-between my-2">
                <div className="flex">
                  <ProfileImg
                    size="sm"
                    photoURL={e.author?.photoURL || ""}
                    onClick={() => router.push(`/profile/${e.author?.id}`)}
                  />
                  <div className="flex items-center min-h-[2rem] ml-1">
                    <div className="text-sm leading-[0.875rem] mt-[0.25rem]">
                      <span
                        className="font-bold hover:cursor-pointer"
                        onClick={() => router.push(`/profile/${e.author?.id}`)}
                      >
                        {e.author?.displayName}
                      </span>
                      <span className="mr-1">
                        {"님이 회원님의 게시물을 좋아합니다"}
                      </span>
                      <span className="inline-block text-xs break-keep text-gray-2">
                        {displayCreatedAt(e.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                {e.post?.imgs.length !== 0 ? (
                  <div
                    className="relative w-8 h-8 pb-8 overflow-hidden duration-500 rounded-sm min-w-[2rem] min-h-[2rem] hover:cursor-pointer"
                    onClick={() => router.push(`/post/${e.post?.id}`)}
                  >
                    <Image
                      className="object-cover bg-transparent"
                      src={e.post?.imgs[0] || ""}
                      alt=""
                      fill
                    />
                  </div>
                ) : (
                  <div
                    className="relative w-8 h-8 pb-8 overflow-hidden duration-500 rounded-sm min-w-[2rem] min-h-[2rem] hover:cursor-pointer"
                    style={{ backgroundColor: e.post.color }}
                    onClick={() => router.push(`/post/${e.post?.id}`)}
                  ></div>
                )}
              </div>
            )}
          </>
        ))}
      </div>
    </>
  );
}
