import { useRouter } from "next/router";
import { useEffect } from "react";
import IconBtn from "../components/atoms/IconBtn";
import { useUser } from "../stores/useUser";
import InfinitePage from "../components/InfinitePage";
import { useAlarm } from "../stores/useAlarm";
import { useModal } from "../stores/useModal";
import { useScrollSave } from "../stores/useScrollSave";
import ScrollTop from "../components/atoms/ScrollTop";

export default function Alarm() {
  const { curUser } = useUser();
  const { alarms, getAlarms } = useAlarm();
  const { setModalLoader } = useModal();
  const { scroll } = useScrollSave();
  useEffect(() => {
    async function init() {
      new Promise((resolve, reject) => {
        setModalLoader(true);
        resolve(0);
      }).then(async () => {
        await getAlarms("init", curUser.id);
        setModalLoader(false);
      });
    }
    scroll["/alarm"] === undefined && init();
    scrollTo(0, 0);
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
