import Feed from "./feed";
import { WrapMotionFade } from "components/wrappers/motion";

export default function Index() {
  return (
    <WrapMotionFade>
      <Feed />
    </WrapMotionFade>
  );
}
