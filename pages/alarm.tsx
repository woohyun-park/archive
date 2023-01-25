import { useStore } from "../apis/zustand";
import MotionFade from "../motions/MotionFade";

export default function Alarm() {
  return (
    <MotionFade>
      <h1 className="title-page">알람</h1>
    </MotionFade>
  );
}
