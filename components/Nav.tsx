import Link from "next/link";
import { useRouter } from "next/router";
import {
  HiHome,
  HiOutlineHome,
  HiMagnifyingGlass,
  HiOutlineMagnifyingGlass,
  // HiSearch,
  // HiOutlineSearch,
  HiLightBulb,
  HiOutlineLightBulb,
  HiPlus,
  HiOutlinePlus,
  HiPlusCircle,
  HiSparkles,
  HiOutlineSparkles,
  HiOutlinePlusCircle,
  HiUser,
  HiOutlineUser,
} from "react-icons/hi2";
import { SIZE } from "../libs/custom";
import WrapScroll from "./wrappers/WrapScroll";
import { useUser } from "../stores/useUser";

export default function Nav() {
  const { curUser } = useUser();
  const router = useRouter();
  const path = router.pathname;

  return (
    <>
      <WrapScroll>
        <div className="box-border fixed bottom-0 flex justify-around w-full pt-1 pb-8 px-8 bg-white max-w-[480px]">
          <Link href="/" legacyBehavior>
            <div className="flex flex-col items-center align-center hover:cursor-pointer">
              <div className="mb-1">
                {path === "/" ? (
                  <HiHome size={SIZE.icon} />
                ) : (
                  <HiOutlineHome size={SIZE.icon} />
                )}
              </div>
              <div className="text-xs">홈</div>
            </div>
          </Link>
          <Link href="/add" legacyBehavior>
            <a>
              <div className="flex items-center justify-center text-3xl text-white -translate-y-5 bg-black rounded-full w-14 h-14">
                +
              </div>
            </a>
          </Link>
          <Link href="/search" legacyBehavior>
            <div className="flex flex-col items-center align-center hover:cursor-pointer">
              <div className="mb-1">
                {path === "/search" || path === "/search-modal" ? (
                  <HiLightBulb size={SIZE.icon} />
                ) : (
                  <HiOutlineLightBulb size={SIZE.icon} />
                )}
              </div>
              <div className="text-xs">둘러보기</div>
            </div>
          </Link>
          {/* <Link href={`/profile/${curUser.id}`} legacyBehavior>
            <a>
              {router.query.uid === curUser.id ? (
                <HiUser size={SIZE.icon} />
              ) : (
                <HiOutlineUser size={SIZE.icon} />
              )}
            </a>
          </Link> */}
        </div>
      </WrapScroll>
    </>
  );
}
