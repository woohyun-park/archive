import { useCustomRouter } from "hooks";
import Message from "../Message";

export default function PageError() {
  const router = useCustomRouter();

  return (
    <div className="w-full h-[calc(100vh_-_92px)]">
      <Message
        icon="sad"
        message={"원하시는 페이지를 찾을 수 없습니다"}
        detailedMessage={`찾으려는 페이지의 주소가 잘못 입력되었거나,
  주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
  입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주세요`}
        label="아카이브 홈 가기"
        onClick={() => router.push("/")}
      />
    </div>
  );
}
