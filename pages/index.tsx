import WrapMotion from "../components/wrappers/motion/WrapMotionFloat";
import Feed from "./feed";

export default function Index() {
  return (
    <WrapMotion type="fade">
      <Feed />
    </WrapMotion>
  );
}
