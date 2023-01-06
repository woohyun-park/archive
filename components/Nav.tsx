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
  const { user, setUser } = useStore();
  const router = useRouter();
  return (
    <>
      <div className="cont">
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
        <Link href={`/profile/${user.uid}}`} legacyBehavior>
          <a>
            {router.pathname === `/profile/${user.uid}` ? (
              <HiUser size={SIZE.icon} />
            ) : (
              <HiOutlineUser size={SIZE.icon} />
            )}
          </a>
        </Link>
      </div>

      <style jsx>{`
        a {
          color: ${COLOR.txt1};
        }
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
