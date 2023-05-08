import { icon_sad, icon_smile, icon_wink, icon_empty } from "assets";
import Image from "next/image";
import WrapMotion from "components/wrappers/WrapMotion";

type Props = {
  icon: "none" | "sad" | "smile" | "wink" | "empty";
  message: string;
  detailedMessage: string;
};

export default function Message({ icon, message, detailedMessage }: Props) {
  return (
    <WrapMotion
      className="flex flex-col items-center w-full pb-8 mb-24"
      type="float"
      key={crypto.randomUUID()}
    >
      {icon !== "none" && (
        <div className="w-16">
          {icon === "sad" && <Image src={icon_sad} alt="" />}
          {icon === "smile" && <Image src={icon_smile} alt="" />}
          {icon === "wink" && <Image src={icon_wink} alt="" />}
          {icon == "empty" && <Image src={icon_empty} alt="" />}
        </div>
      )}
      <div className="mb-1 text-xl text-bold">{message}</div>
      <div className="mb-6 text-xs leading-4 text-center whitespace-pre-wrap text-gray-2">
        {detailedMessage}
      </div>
    </WrapMotion>
  );
}
