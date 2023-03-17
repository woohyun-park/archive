import Message from "../components/Message";
import useCustomRouter from "../hooks/useCustomRouter";
import { useLoading } from "../hooks/useLoading";

// 원래 next.js에서는 pages/404 파일을 만들면 매칭되지 않는 페이지로 이동할때 해당 페이지를 띄워주는데,
// 무슨 이유에서인지 'attempted to hard navigate to the same URL'이라는 에러가 발생했다.
// pages/[...404]와 같은 형식으로 파일을 만들면 custom 404 page와 비슷하게 동작한다는 workaround를 발견하여 적용하였다.

// 참조: https://github.com/vercel/next.js/issues/43088

export default function ErrorPage() {
  const router = useCustomRouter();

  useLoading([]);

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
