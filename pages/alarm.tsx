import { useRouter } from "next/router";
import BtnIcon from "../components/atoms/BtnIcon";
import { useUser } from "../stores/useUser";
import Motion from "../components/wrappers/WrapMotion";
import PageAlarms from "../components/PageAlarms";
import { useLoading } from "../hooks/useLoading";

export default function Alarm() {
  const router = useRouter();

  return (
    <Motion type="fade">
      <div className="flex m-4">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-base">알림</div>
      </div>
      <PageAlarms />
    </Motion>
  );
}
