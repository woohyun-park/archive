import { SIZE } from "../libs/custom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";
import WrapMotion from "../components/wrappers/WrapMotion";
import PagePosts from "../components/PagePosts";
import { useLoading } from "../hooks/useLoading";

export default function Search() {
  useLoading(["posts"]);

  return (
    <WrapMotion type="fade" className="pt-2 bg-white">
      <Link href="/search-modal">
        <div className="flex mx-4">
          <div className="flex items-center w-full px-[0.25rem] py-[0.375rem] my-[0.75rem] mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
            <HiMagnifyingGlass size={SIZE.iconSm} className="scale-75" />
          </div>
        </div>
      </Link>
      <PagePosts
        query={{ type: "none", readType: "simple", value: {} }}
        as="posts"
        numCols={3}
      />
    </WrapMotion>
  );
}
