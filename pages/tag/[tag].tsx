import { useRouter } from "next/router";
import MotionFade from "../../motions/MotionFade";

export default function Tag({}) {
  const router = useRouter();
  return (
    <MotionFade>
      <div>
        <h4>tag</h4>
      </div>
    </MotionFade>
  );
}
