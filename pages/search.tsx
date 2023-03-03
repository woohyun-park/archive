import { SIZE } from "../libs/custom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";
import WrapMotion from "../components/wrappers/WrapMotion";
import PagePosts from "../components/PagePosts";

export default function Search() {
  return (
    <WrapMotion type="fade" className="px-4 pt-2 pb-24 bg-white">
      <Link href="/search-modal">
        <div className="flex">
          <div className="flex items-center w-full px-[0.25rem] py-[0.375rem] my-[0.75rem] mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
            <HiMagnifyingGlass size={SIZE.iconSm} className="scale-75" />
          </div>
        </div>
      </Link>
      <PagePosts query={{ type: "none", value: {} }} as="posts" numCols={3} />
    </WrapMotion>
  );
}
