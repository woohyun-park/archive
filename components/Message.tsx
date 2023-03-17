import Image from "next/image";
import { MouseEventHandler } from "react";
import { mergeTailwindClasses } from "../apis/tailwind";
import useCustomRouter from "../hooks/useCustomRouter";
import icon_sad from "../imgs/icon_sad.svg";
import icon_smile from "../imgs/icon_smile.svg";
import icon_wink from "../imgs/icon_wink.svg";
import Btn from "./atoms/Btn";

interface IMessage {
  icon: "none" | "sad" | "smile" | "wink";
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
