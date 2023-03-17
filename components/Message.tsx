import Image from "next/image";
import { MouseEventHandler } from "react";
import useCustomRouter from "../hooks/useCustomRouter";
import icon_sad from "../imgs/icon_sad.svg";
import Btn from "./atoms/Btn";

interface IMessage {
  includeIcon?: boolean;
  includeBtn?: boolean;
  message?: string;
  detailedMessage?: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Message({
  includeIcon = false,
  includeBtn = false,
  message,
  detailedMessage,
  label,
  onClick,
}: IMessage) {
  const router = useCustomRouter();

  return (
    <>
      <div className="flex items-center w-full min-h-[75vh] h-full">
        <div className="flex flex-col items-center w-full ">
          {includeIcon && (
            <div className="w-24">
              <Image src={icon_sad} alt="" />
            </div>
          )}
          <div className="mb-1 text-xl text-bold">{message}</div>
          <div className="mb-6 text-sm leading-4 text-center whitespace-pre-wrap text-gray-2">
            {detailedMessage}
          </div>
          {includeBtn && <Btn label={label || ""} onClick={onClick} />}
        </div>
      </div>
    </>
  );
}
