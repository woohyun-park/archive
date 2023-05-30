import Image from "next/image";
import { MouseEventHandler } from "react";
import { mergeTailwindClasses } from "../apis/tailwind";
import icon_sad from "../assets/icon_sad.svg";
import icon_smile from "../assets/icon_smile.svg";
import icon_wink from "../assets/icon_wink.svg";
import icon_empty from "../assets/icon_empty.svg";
import Btn from "./atoms/Btn";
import { useCustomRouter } from "hooks";

interface IMessage {
  icon: "none" | "sad" | "smile" | "wink" | "empty";
  message?: string;
  detailedMessage?: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  minHeight?: string;
}

export default function Message({
  icon,
  message,
  detailedMessage,
  label,
  onClick,
  className,
  minHeight,
}: IMessage) {
  const router = useCustomRouter();

  return (
    <>
      <div
        className={mergeTailwindClasses(
          "flex items-center w-full min-h-[75vh] h-full",
          minHeight || ""
        )}
      >
        <div
          className={mergeTailwindClasses(
            "items-center w-full flex-col flex",
            className || ""
          )}
        >
          {icon !== "none" && (
            <div className="w-24">
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
          {label && <Btn label={label || ""} onClick={onClick} />}
        </div>
      </div>
    </>
  );
}
