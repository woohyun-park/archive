import { useStore } from "../apis/useStore";
import Motion from "../motions/Motion";

export default function Alarm() {
  return (
    <Motion type="fade">
      <h1 className="title-page">알람</h1>
    </Motion>
  );
}
