import { useRouter } from "next/router";
import IconBtn from "../components/atoms/IconBtn";

export default function Alarm() {
  const router = useRouter();
  return (
    <div className="flex mt-16">
      <IconBtn icon="back" onClick={() => router.back()} />
      <div className="title-page">알림</div>
    </div>
  );
}
