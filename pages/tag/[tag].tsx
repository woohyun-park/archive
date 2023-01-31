import { useRouter } from "next/router";
import Motion from "../../motions/Motion";

export default function Tag({}) {
  const router = useRouter();
  return (
    <Motion type="fade">
      <div>
        <h4>tag</h4>
      </div>
    </Motion>
  );
}
