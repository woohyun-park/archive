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

export default function Nav() {
  const router = useRouter();
  return (
    <>
      <Link href="/">
        {router.pathname === "/" ? <HiHome /> : <HiOutlineHome />}
      </Link>
      <Link href="/search">
        {router.pathname === "/search" ? <HiSearch /> : <HiOutlineSearch />}
      </Link>
      <Link href="/add">
        {router.pathname === "/add" ? <HiPlus /> : <HiOutlinePlus />}
      </Link>
      <Link href="/alarm">
        {router.pathname === "/alarm" ? <HiBell /> : <HiOutlineBell />}
      </Link>
      <Link href="/profile">
        {router.pathname === "/profile" ? <HiUser /> : <HiOutlineUser />}
      </Link>
    </>
  );
}
