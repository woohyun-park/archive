import { useRouter } from "next/router";
import BtnIcon from "../components/atoms/BtnIcon";
import WrapMotion from "../components/wrappers/WrapMotion";
import PageAlarms from "../components/PageAlarms";

export default function Alarm() {
  const router = useRouter();

  return (
    <WrapMotion type="fade" className="mb-24">
      <div className="flex m-4">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-base">알림</div>
      </div>
      <PageAlarms />
    </WrapMotion>
  );
}
