import Image from "next/image";
import useCustomRouter from "../hooks/useCustomRouter";
import icon_sad from "../imgs/icon_sad.svg";
import Btn from "./atoms/Btn";

export default function ErrorBox() {
  const router = useCustomRouter();
  return (
    <>
      <div className="absolute top-0 left-0 flex items-center w-full h-[calc(100vh_-_92px)]">
        <div className="flex flex-col items-center w-full ">
          <div className="w-24">
            <Image src={icon_sad} alt="" />
          </div>
          <div className="text-xl text-bold">
            원하시는 페이지를 찾을 수 없습니다
          </div>
          <div className="text-sm text-gray-2">
            찾으려는 페이지의 주소가 잘못 입력되었거나,
          </div>
          <div className="text-sm text-gray-2">
            주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
          </div>
          <div className="mb-6 text-sm text-gray-2">
            입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주세요
          </div>
          <Btn label="아카이브 홈 가기" onClick={() => router.push("/")} />
        </div>
      </div>
    </>
  );
}
