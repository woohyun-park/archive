import List from "../components/views/List";
import { SIZE } from "../libs/custom";
import { HiSearch } from "react-icons/hi";
import { useStore } from "../stores/useStore";
import Link from "next/link";
import Motion from "../motions/Motion";
import Box from "../components/Box";
import Loader from "../components/Loader";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useSearch } from "../stores/useSearch";
import { useKeyword } from "../stores/useKeyword";
import { useEffect } from "react";

export default function Search() {
  const { gSearch, gPage, gSetPage, gSetSearch } = useStore();
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
            <div className="flex items-center w-full p-1 mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiSearch size={SIZE.iconSm} />
            </div>
          </div>
        </Link>
        <div className="grid grid-cols-3 mt-4 mb-16 gap-y-2 gap-x-2">
          {posts.map((e, i) => (
            <>
              <div>
                <Box
                  key={"search" + e.id}
                  post={{ ...e, id: e.id }}
                  includeTitle={true}
                  includeTag={true}
                ></Box>
              </div>
              {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
            </>
          ))}
        </div>
        <div className="flex justify-center"> {loading && <Loader />}</div>
      </Motion>
    </>
  );
}
