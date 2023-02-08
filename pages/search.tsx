import { SIZE } from "../libs/custom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";
import Motion from "../motions/Motion";
import Box from "../components/Box";
import Loader from "../components/Loader";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useSearch } from "../stores/useSearch";
import { useEffect } from "react";
import PostBox from "../components/PostBox";

export default function Search() {
  const { posts, getPosts } = useSearch();
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => getPosts("load"),
    handleChange: () => {},
    changeListener: posts,
  });
  useEffect(() => {
    getPosts("init");
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
        <PostBox
          type="search"
          posts={posts}
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
