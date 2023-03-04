import { useRouter } from "next/router";
import BtnIcon from "../components/atoms/BtnIcon";
import { useUser } from "../stores/useUser";
import WrapScroll from "../components/wrappers/WrapScroll";
import Motion from "../components/wrappers/WrapMotion";
import PageAlarms from "../components/PageAlarms";
import { useLoading } from "../hooks/useLoading";

export default function Alarm() {
  const router = useRouter();

  const { curUser } = useUser();
  useLoading(["alarms"]);

  return (
    <Motion type="fade">
      <div className="flex m-4">
        <WrapScroll className="flex">
          <BtnIcon icon="back" onClick={() => router.back()} />
        </WrapScroll>
        <div className="title-page-base">알림</div>
      </div>
      <PageAlarms
        query={{ type: "uid", value: { uid: curUser.id } }}
        className="px-4"
      />
    </Motion>
  );
}
