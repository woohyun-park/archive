import Link from "next/link";
import { useRouter } from "next/router";
import {
  HiHome,
  HiOutlineHome,
  HiSearch,
  HiOutlineSearch,
  HiPlus,
  HiOutlinePlus,
  HiBell,
  HiOutlineBell,
  HiUser,
  HiOutlineUser,
} from "react-icons/hi";
import { useStore } from "../apis/zustand";
import { SIZE } from "../custom";

export default function Nav() {
  const { gCurUser } = useStore();
  const router = useRouter();
  const path = router.pathname;

  return (
    <>
      <div className="box-border fixed bottom-0 flex justify-around w-full pt-6 pb-9 bg-white max-w-[480px]">
        <Link href="/" legacyBehavior>
          <a>
            {path === "/" ? (
              <HiHome size={SIZE.icon} />
            ) : (
              <HiOutlineHome size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href="/search" legacyBehavior>
          <a>
            {path === "/search" || path === "/search-modal" ? (
              <HiSearch size={SIZE.icon} />
            ) : (
              <HiOutlineSearch size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href="/add" legacyBehavior>
          <a>
            {path === "/add" ? (
              <HiPlus size={SIZE.icon} />
            ) : (
              <HiOutlinePlus size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href="/alarm" legacyBehavior>
          <a>
            {path === "/alarm" ? (
              <HiBell size={SIZE.icon} />
            ) : (
              <HiOutlineBell size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href={`/profile/${gCurUser.id}`} legacyBehavior>
          <a>
            {router.query.uid === gCurUser.id ? (
              <HiUser size={SIZE.icon} />
            ) : (
              <HiOutlineUser size={SIZE.icon} />
            )}
          </a>
        </Link>
      </div>
    </>
  );
}
