import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IconBtn from "../components/atoms/IconBtn";
import { getDatasByQuery, db, getData } from "../apis/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { useUser } from "../stores/useUser";
import { IAlarm, IComment, ILike, IPost, IUser } from "../libs/custom";
import AlarmLike from "../components/AlarmLike";
import AlarmComment from "../components/AlarmComment";
import AlarmFollow from "../components/AlarmFollow";
import PostBox from "../components/PostBox";
import { useAlarm } from "../stores/useAlarm";

export default function Alarm() {
  const { curUser } = useUser();
  const { alarms, getAlarms } = useAlarm();

  async function init() {
    // const res: IAlarm[] = await getDatasByQuery(
    //   query(
    //     collection(db, "alarms"),
    //     where("targetUid", "==", curUser.id),
    //     orderBy("createdAt", "desc")
    //   )
    // );
    // for await (const alarm of res) {
    //   if (alarm.type === "like") {
    //     const author = await getData<IUser>("users", alarm.uid);
    //     const post = await getData<IPost>("posts", alarm.targetPid || "");
    //     alarm.author = author;
    //     alarm.post = post;
    //   } else if (alarm.type === "comment") {
    //     const author = await getData<IUser>("users", alarm.uid);
    //     const comment = await getData<IComment>(
    //       "comments",
    //       alarm.targetCid || ""
    //     );
    //     const post = await getData<IPost>("posts", alarm.targetPid || "");
    //     alarm.author = author;
    //     alarm.post = post;
    //     alarm.comment = comment;
    //   } else if (alarm.type === "follow") {
    //     const author = await getData<IUser>("users", alarm.uid);
    //     alarm.author = author;
    //   }
    // }
    getAlarms("init", curUser.id);
  }
  useEffect(() => {
    init();
  }, []);
  const router = useRouter();
  return (
    <>
      <div className="flex my-2">
        <IconBtn icon="back" onClick={() => router.back()} />
        <div className="title-page">알림</div>
      </div>
      <PostBox
        type="alarm"
        data={alarms}
        onIntersect={() => getAlarms("load", curUser.id)}
        onChange={() => {}}
        onRefresh={async () => {
          await getAlarms("refresh", curUser.id);
        }}
        changeListener={alarms}
      />
      {/* <div className="mt-4">
        {alarms.map((e) => (
          <>
            {e.type === "like" && <AlarmLike alarm={e} />}
            {e.type === "comment" && <AlarmComment alarm={e} />}
            {e.type === "follow" && <AlarmFollow alarm={e} />}
          </>
        ))}
      </div> */}
    </>
  );
}
