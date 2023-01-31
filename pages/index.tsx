import Motion from "../motions/Motion";
import Feed from "./feed";

export default function Index() {
  return (
    <Motion type="fade">
      <Feed />
    </Motion>
  );
}
