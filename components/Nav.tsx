import {
  HiHome,
  HiLightBulb,
  HiOutlineHome,
  HiOutlineLightBulb,
} from "react-icons/hi2";

import { SIZE } from "../apis/def";
import { useCustomRouter } from "hooks";

export default function Nav() {
  const router = useCustomRouter();
  const path = router.pathname;

  return (
    <>
      {!(path === "/setting" || path === "/add" || path === "/post/[id]") && (
        <div className="box-border fixed bottom-0 grid grid-cols-3 justify-around w-full pt-1 pb-8 px-8 bg-white max-w-[480px] z-10">
          {path !== "/" ? (
            <div
              onClick={() => router.push("/")}
              className="flex flex-col items-center align-center hover:cursor-pointer"
            >
              <div className="mb-1">
                {path === "/" ? (
                  <HiHome size={SIZE.icon} />
                ) : (
                  <HiOutlineHome size={SIZE.icon} />
                )}
              </div>
              <div className="text-xs">홈</div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center align-center hover:cursor-pointer"
              onClick={() =>
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
              }
            >
              <div className="mb-1">
                {path === "/" ? (
                  <HiHome size={SIZE.icon} />
                ) : (
                  <HiOutlineHome size={SIZE.icon} />
                )}
              </div>
              <div className="text-xs">홈</div>
            </div>
          )}
          <div
            className="flex items-center justify-center"
            onClick={() => router.push("/add")}
          >
            <div className="flex items-center justify-center text-3xl text-white -translate-y-5 bg-black rounded-full hover:cursor-pointer w-14 h-14">
              +
            </div>
          </div>
          <div
            className="flex flex-col items-center mb-1 align-center hover:cursor-pointer"
            onClick={() => router.push("/search")}
          >
            <div className="mb-1">
              {path === "/search" ? (
                <HiLightBulb size={SIZE.icon} />
              ) : (
                <HiOutlineLightBulb size={SIZE.icon} />
              )}
            </div>
            <div className="text-xs">둘러보기</div>
          </div>
        </div>
      )}
    </>
  );
}
