import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../components/atoms/BtnIcon";
import { useUser } from "../stores/useUser";
import Page from "../components/Page";
import { useStatus } from "../stores/useStatus";
import WrapScroll from "../components/wrappers/WrapScroll";
import Motion from "../components/wrappers/WrapMotion";
import { useCachedPage } from "../hooks/useCachedPage";

export default function Alarm() {
  const router = useRouter();

  const { curUser } = useUser();
  const { setModalLoader, modalLoader } = useStatus();
  const { scroll } = useStatus();
  const { data, isLast, fetchAlarms } = useCachedPage("alarms");

  const path = router.asPath;

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        fetchAlarms && (await fetchAlarms("init", path, curUser.id));
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        scrollTo(0, scroll[path]);
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
            data={data}
            onIntersect={() =>
              fetchAlarms && fetchAlarms("load", path, curUser.id)
            }
            onChange={() => {}}
            onRefresh={async () => {
              fetchAlarms && (await fetchAlarms("refresh", path, curUser.id));
            }}
            changeListener={data}
            isLast={isLast}
            minHeight="50vh"
          />
          <div className="mb-32"></div>
        </>
      )}
    </Motion>
  );
}
