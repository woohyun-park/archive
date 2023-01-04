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
import { SIZE } from "../custom";

export default function Nav() {
  const router = useRouter();
  return (
    <>
      <div className="cont">
        <Link href="/" legacyBehavior>
          {router.pathname === "/" ? (
            <HiHome size={SIZE.icon} />
          ) : (
            <HiOutlineHome size={SIZE.icon} />
          )}
        </Link>
        <Link href="/search" legacyBehavior>
          {router.pathname === "/search" ? (
            <HiSearch size={SIZE.icon} />
          ) : (
            <HiOutlineSearch size={SIZE.icon} />
          )}
        </Link>
        <Link href="/add" legacyBehavior>
          {router.pathname === "/add" ? (
            <HiPlus size={SIZE.icon} />
          ) : (
            <HiOutlinePlus size={SIZE.icon} />
          )}
        </Link>
        <Link href="/alarm" legacyBehavior>
          {router.pathname === "/alarm" ? (
            <HiBell size={SIZE.icon} />
          ) : (
            <HiOutlineBell size={SIZE.icon} />
          )}
        </Link>
        <Link href="/profile" legacyBehavior>
          {router.pathname === "/profile" ? (
            <HiUser size={SIZE.icon} />
          ) : (
            <HiOutlineUser size={SIZE.icon} />
          )}
        </Link>
      </div>

      <style jsx>{`
        .cont {
          display: flex;
          justify-content: space-around;
          position: fixed;
          bottom: 0;
          background-color: white;
          padding: 12px 24px 36px 24px;
          width: 100%;
          max-width: 480px;
          box-sizing: border-box;
        }
      `}</style>
    </>
  );
}
