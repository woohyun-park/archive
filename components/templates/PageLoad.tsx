import Image from "next/image";
import { WrapMotionRoll } from "components/wrappers/motion";
import icon_smile from "assets/icon_smile.svg";

export default function PageLoad() {
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
