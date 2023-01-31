import List from "../components/views/List";
import { SIZE } from "../custom";
import { HiSearch } from "react-icons/hi";
import { useStore } from "../apis/useStore";
import Link from "next/link";
import Motion from "../motions/Motion";
import Box from "../components/Box";
import Loader from "../components/Loader";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Search() {
  const { gSearch, gPage, gSetPage, gSetSearch } = useStore();
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => gSetPage("search", "post", gPage.search.post + 1),
    handleChange: () => gSetSearch("posts", gPage.search.post),
    changeListener: gPage.search.post,
  });

  return (
    <>
      <Motion type="fade">
        <h1 className="title-page">검색</h1>
        <Link href="/search-modal">
          <div className="flex">
            <div className="flex items-center w-full p-1 mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiSearch size={SIZE.iconSm} />
            </div>
          </div>
        </Link>
        <div className="grid grid-cols-3 mt-4 mb-16 gap-y-2 gap-x-2">
          {gSearch.posts.map((e, i) => (
            <>
              <div>
                <Box post={{ ...e, id: e.id }} key={e.id}></Box>
              </div>
              {i === gSearch.posts.length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
            </>
          ))}
        </div>
        <div className="flex justify-center"> {loading && <Loader />}</div>
      </Motion>
    </>
  );
}
