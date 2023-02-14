import { useRouter } from "next/router";
import { useEffect } from "react";
import IconBtn from "../components/atoms/IconBtn";
import { useUser } from "../stores/useUser";
import InfinitePage from "../components/InfinitePage";
import { useAlarm } from "../stores/useAlarm";

export default function Alarm() {
  const { curUser } = useUser();
  const { alarms, getAlarms } = useAlarm();
  useEffect(() => {
    getAlarms("init", curUser.id);
  }, []);
  const router = useRouter();
  return (
    <>
      <div className="flex my-2">
        <IconBtn icon="back" onClick={() => router.back()} />
        <div className="title-page">알림</div>
      </div>
      <InfinitePage
        page="alarm"
        data={alarms}
        onIntersect={() => getAlarms("load", curUser.id)}
        onChange={() => {}}
        onRefresh={async () => {
          await getAlarms("refresh", curUser.id);
        }}
        changeListener={alarms}
      />
      <div className="mb-32"></div>
    </>
  );
}
