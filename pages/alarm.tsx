import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../components/atoms/BtnIcon";
import { useUser } from "../stores/useUser";
import { useStatus } from "../stores/useStatus";
import WrapScroll from "../components/wrappers/WrapScroll";
import Motion from "../components/wrappers/WrapMotion";
import { useCachedPage } from "../hooks/useCachedPage";
import PageAlarms from "../components/PageAlarms";

export default function Alarm() {
  const router = useRouter();

  const { curUser } = useUser();
  const { setModalLoader, modalLoader } = useStatus();
  const { scroll } = useStatus();
  const { data, isLast, fetchAlarms } = useCachedPage("alarms");

  const path = router.asPath;

  return (
    <Motion type="fade">
      {!modalLoader && (
        <>
          <div className="flex m-4">
            <WrapScroll className="flex">
              <BtnIcon icon="back" onClick={() => router.back()} />
            </WrapScroll>
            <div className="title-page-base">알림</div>
          </div>
          <PageAlarms query={{ type: "uid", value: { uid: curUser.id } }} />
        </>
      )}
    </Motion>
  );
}
