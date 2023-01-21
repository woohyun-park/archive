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
import { COLOR, SIZE } from "../custom";

export default function Nav() {
  const { gCurUser } = useStore();
  const router = useRouter();

  return (
    <>
      <div className="box-border fixed bottom-0 flex justify-around w-full pt-6 pb-9 bg-white max-w-[480px]">
        <Link href="/" legacyBehavior>
          <a>
            {router.pathname === "/" ? (
              <HiHome size={SIZE.icon} />
            ) : (
              <HiOutlineHome size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href="/search" legacyBehavior>
          <a>
            {router.pathname === "/search" ? (
              <HiSearch size={SIZE.icon} />
            ) : (
              <HiOutlineSearch size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href="/add" legacyBehavior>
          <a>
            {router.pathname === "/add" ? (
              <HiPlus size={SIZE.icon} />
            ) : (
              <HiOutlinePlus size={SIZE.icon} />
            )}
          </a>
        </Link>
        <Link href="/alarm" legacyBehavior>
          <a>
            {router.pathname === "/alarm" ? (
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
