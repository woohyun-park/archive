import Image from "next/image";
import icon_smile from "assets/icon_smile.svg";
import { WrapMotionRoll } from "components/wrappers/motion";

export default function Spinner() {
  return (
    <div className="flex flex-col items-center bg-white">
      <WrapMotionRoll>
        <div className="w-16">
          <Image src={icon_smile} alt="" />
        </div>
      </WrapMotionRoll>
      <div className="-mt-1 text-sm">LOADING</div>
    </div>
  );
}
