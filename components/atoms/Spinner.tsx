import Image from "next/image";
import WrapMotion from "../wrappers/WrapMotion";
import icon_smile from "../../assets/icon_smile.svg";

export default function Spinner() {
  return (
    <div className="flex flex-col items-center bg-white">
      <WrapMotion type="roll">
        <div className="w-16">
          <Image src={icon_smile} alt="" />
        </div>
      </WrapMotion>
      <div className="-mt-1 text-sm">LOADING</div>
    </div>
  );
}
