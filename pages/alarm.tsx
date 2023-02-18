import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../components/atoms/BtnIcon";
import { useUser } from "../stores/useUser";
import Page from "../components/Page";
import { useAlarm } from "../stores/useAlarm";
import { useModal } from "../stores/useModal";
import { useStatus } from "../stores/useStatus";
import WrapScroll from "../components/wrappers/WrapScroll";
import Motion from "../components/wrappers/WrapMotion";
import { IAlarm } from "../libs/custom";
import { readAlarm } from "../apis/fbRead";

export default function Alarm() {
  const router = useRouter();

  const { curUser } = useUser();
  const { alarms, isLast, getAlarms, setAlarms } = useAlarm();
  const { setModalLoader, modalLoader } = useModal();
  const { scroll } = useStatus();

  useEffect(() => {
    async function init() {
      if (scroll[router.asPath] === undefined) {
        await getAlarms("init", curUser.id);
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        if (!curUser.alarms) return;
        const tempAlarms = [...curUser.alarms].filter(
          (e1) =>
            !alarms.find((e2) => {
              return e1.id === e2.id;
            })
        );
        const newAlarms: IAlarm[] = [];
        for await (const tempAlarm of tempAlarms) {
          const alarm = await readAlarm(tempAlarm.id);
          alarm && newAlarms.push(alarm);
        }
        console.log(newAlarms, alarms);
        setAlarms([...newAlarms, ...alarms]);
        scrollTo(0, scroll[router.asPath]);
      }
    }
    init();
  }, []);

  return (
    <Motion type="fade">
      {!modalLoader && (
        <>
          <div className="flex mt-2 mb-4">
            <WrapScroll className="flex">
              <BtnIcon icon="back" onClick={() => router.back()} />
            </WrapScroll>
            <div className="title-page-base">알림</div>
          </div>
          <Page
            page="alarm"
            data={alarms}
            onIntersect={() => getAlarms("load", curUser.id)}
            onChange={() => {}}
            onRefresh={async () => {
              await getAlarms("refresh", curUser.id);
            }}
            changeListener={alarms}
            isLast={isLast}
            minHeight="50vh"
          />
          <div className="mb-32"></div>
        </>
      )}
    </Motion>
  );
}
