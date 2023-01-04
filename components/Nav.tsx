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

const ICON_SIZE = "24px";

export default function Nav() {
  const router = useRouter();
  return (
    <>
      <div className="cont">
        <Link href="/" legacyBehavior>
          {router.pathname === "/" ? (
            <HiHome size={ICON_SIZE} />
          ) : (
            <HiOutlineHome size={ICON_SIZE} />
          )}
        </Link>
        <Link href="/search" legacyBehavior>
          {router.pathname === "/search" ? (
            <HiSearch size={ICON_SIZE} />
          ) : (
            <HiOutlineSearch size={ICON_SIZE} />
          )}
        </Link>
        <Link href="/add" legacyBehavior>
          {router.pathname === "/add" ? (
            <HiPlus size={ICON_SIZE} />
          ) : (
            <HiOutlinePlus size={ICON_SIZE} />
          )}
        </Link>
        <Link href="/alarm" legacyBehavior>
          {router.pathname === "/alarm" ? (
            <HiBell size={ICON_SIZE} />
          ) : (
            <HiOutlineBell size={ICON_SIZE} />
          )}
        </Link>
        <Link href="/profile" legacyBehavior>
          {router.pathname === "/profile" ? (
            <HiUser size={ICON_SIZE} />
          ) : (
            <HiOutlineUser size={ICON_SIZE} />
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
