import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  HiHome,
  HiOutlineHome,
  HiLightBulb,
  HiOutlineLightBulb,
} from "react-icons/hi2";
import { SIZE } from "../libs/custom";
import Motion from "../motions/Motion";
import { useModal } from "../stores/useModal";
import { useScrollSave } from "../stores/useScrollSave";
import ScrollTop from "./atoms/ScrollTop";
import ModalLoader from "./ModalLoader";
import WrapScroll from "./wrappers/WrapScroll";

export default function Nav() {
  const router = useRouter();
  const path = router.pathname;
  const { modalLoader, setModalLoader } = useModal();
  const { scroll } = useScrollSave();

  useEffect(() => {
    setModalLoader(false);
  }, [router.pathname]);

  return (
    <>
      <ModalLoader isVisible={modalLoader} />
      {!(
        router.pathname === "/setting" ||
        router.pathname === "/add" ||
        router.pathname.split("/")[1] === "post"
      ) && (
        <WrapScroll>
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
              className="flex flex-col items-center align-center hover:cursor-pointer"
              onClick={() => router.push("/search")}
            >
              <div className="mb-1">
                {path === "/search" || path === "/search-modal" ? (
                  <HiLightBulb size={SIZE.icon} />
                ) : (
                  <HiOutlineLightBulb size={SIZE.icon} />
                )}
              </div>
              <div className="text-xs">둘러보기</div>
            </div>
          </div>
        </WrapScroll>
      )}
    </>
  );
}
