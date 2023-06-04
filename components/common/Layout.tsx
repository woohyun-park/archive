import { COLOR } from "apis/def";
import Nav from "components/Nav";
import { ScrollUpAndDown } from "components/molecules";
import { WrapMotionFade } from "components/wrappers/motion";
import { useCustomRouter } from "hooks";
import { useUser } from "providers/UserProvider";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { data } = useUser();
  const router = useCustomRouter();

  return (
    <>
      <WrapMotionFade>{children}</WrapMotionFade>
      {router.pathname === "/" && (
        <div className="flex justify-end fixed bottom-32 max-w-[480px] w-full pr-8">
          <ScrollUpAndDown />
        </div>
      )}
      <Nav />

      <style jsx global>
        {`
          #__next {
            width: 100%;
          }
          #layout_naver {
            color: ${COLOR["black"]};
            transform: scale(1.2);
          }
          :root {
            display: flex;
            justify-content: center;
            width: 100%;
            background-color: ${COLOR["gray-4f"]};
          }
          body {
            overflow: ${router.pathname === "/search/[keyword]" ||
            router.pathname === "/profile/[uid]"
              ? "hidden"
              : "scroll"};
            margin: 0;
            width: 100vw;
            max-width: 480px;
            min-height: ${!data
              ? "100vh"
              : router.pathname === "/setting" ||
                router.pathname === "/add" ||
                router.pathname === "/post/[id]"
              ? "100vh"
              : "calc(100vh - 72px)"};
            max-height: ${router.pathname === "/setting" ? "100vh" : ""};
            background-color: ${COLOR["white"]};
            box-sizing: border-box;
            display: ${data ? "" : "flex"};
            justify-content: center;
            align-items: center;
          }
          body::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </>
  );
}
