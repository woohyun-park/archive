import { useRouter } from "next/router";
import { useEffect } from "react";
import IconBtn from "../components/atoms/IconBtn";
import { useUser } from "../stores/useUser";
import PageInfinite from "../components/PageInfinite";
import { useAlarm } from "../stores/useAlarm";
import { useModal } from "../stores/useModal";
import { useScrollSave } from "../stores/useScrollSave";
import WrapScroll from "../components/wrappers/WrapScroll";

export default function Alarm() {
  const router = useRouter();

  const { curUser } = useUser();
  const { alarms, getAlarms, isLast } = useAlarm();
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
    if (scroll["/alarm"] !== undefined) {
      scrollTo(0, scroll["/alarm"]);
    } else {
      init();
      scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <div className="flex mt-2 mb-4">
        <WrapScroll>
          <IconBtn icon="back" onClick={() => router.back()} />
        </WrapScroll>
        <div className="title-page">알림</div>
      </div>
      <PageInfinite
        page="alarm"
        data={alarms}
        onIntersect={() => getAlarms("load", curUser.id)}
        onChange={() => {}}
        onRefresh={async () => {
          await getAlarms("refresh", curUser.id);
        }}
        changeListener={alarms}
        isLast={isLast}
      />
      <div className="mb-32"></div>
    </>
  );
}
