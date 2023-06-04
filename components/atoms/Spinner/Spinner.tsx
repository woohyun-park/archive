import Image from "next/image";
import { WrapMotionRoll } from "components/wrappers/motion";
import icon_smile from "assets/icon_smile.svg";

export default function Spinner() {
  return (
    <div className="flex">
      <WrapMotionRoll>
        <div className="w-16">
          <Image src={icon_smile} alt="" />
        </div>
      </WrapMotionRoll>
    </div>
  );
}
