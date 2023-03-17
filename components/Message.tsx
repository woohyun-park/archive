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
  //   message={"원하시는 페이지를 찾을 수 없습니다"}
  //   detailedMessage={`찾으려는 페이지의 주소가 잘못 입력되었거나,
  // 주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
  // 입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주세요`}
  //   label="아카이브 홈 가기"
  //   onClick={() => router.push("/")}
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
          <div className="mb-6 text-sm text-center whitespace-pre-wrap text-gray-2">
            {detailedMessage}
          </div>
          {includeBtn && <Btn label={label || ""} onClick={onClick} />}
        </div>
      </div>
    </>
  );
}
