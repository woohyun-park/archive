import { SIZE } from "../libs/custom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";
import Motion from "../motions/Motion";
import { useSearch } from "../stores/useSearch";
import { useEffect, useState } from "react";
import PageInfinite from "../components/PageInfinite";
import { useRouter } from "next/router";
import { useScrollSave } from "../stores/useScrollSave";

export default function Search() {
  const { posts, getPosts } = useSearch();
  const { scroll, setScroll } = useScrollSave();
  const router = useRouter();
  useEffect(() => {
    async function init() {
      if (!scroll[router.pathname]) {
        await getPosts("init");
        setScroll(router.pathname, 0);
      }
    }
    init();
  }, []);

  return (
    <>
      <Motion type="fade">
        <Link href="/search-modal">
          <div className="flex">
            <div className="flex items-center w-full px-[0.25rem] py-[0.375rem] my-[0.75rem] mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiMagnifyingGlass size={SIZE.iconSm} className="scale-75" />
            </div>
          </div>
        </Link>
        <PageInfinite
          page="search"
          data={posts}
          onIntersect={() => getPosts("load")}
          onChange={() => {}}
          onRefresh={async () => await getPosts("refresh")}
          changeListener={posts}
        />
      </Motion>
      <div className="mb-24"></div>
    </>
  );
}
