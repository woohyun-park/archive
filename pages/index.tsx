import WrapMotion from "../components/wrappers/WrapMotion";
import Feed from "./feed";

export default function Index() {
  return (
    <WrapMotion type="fade">
      <Feed />
    </WrapMotion>
  );
}
