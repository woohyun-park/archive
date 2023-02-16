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

export default function Alarm() {
  const router = useRouter();

  const { curUser } = useUser();
  const { alarms, getAlarms, isLast } = useAlarm();
  const { setModalLoader, modalLoader } = useModal();
  const { scroll } = useStatus();

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
          />
          <div className="mb-32"></div>
        </>
      )}
    </Motion>
  );
}
