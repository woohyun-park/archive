import List from "../components/List";
import { SIZE } from "../custom";
import { HiSearch } from "react-icons/hi";
import { useStore } from "../apis/zustand";
import Link from "next/link";
import { useRouter } from "next/router";
import MotionFade from "../motions/motionFade";
import GridPost from "../components/GridPost";

export default function Search() {
  const { gSearch, gPage, gSetPage, gSetSearch } = useStore();
  const router = useRouter();

  return (
    <>
      <MotionFade>
        <h1 className="title-page">검색</h1>
        <Link href="/search-modal">
          <div className="flex">
            <div className="flex items-center w-full p-1 mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiSearch size={SIZE.iconSmall} />
            </div>
          </div>
        </Link>
        <GridPost
          posts={gSearch.posts}
          handleIntersect={() =>
            gSetPage("search", "post", gPage.search.post + 1)
          }
          handleChange={() => gSetSearch("posts", gPage.search.post)}
          changeListener={gPage.search.post}
          option={{
            numCols: 3,
          }}
        />
      </MotionFade>
    </>
  );
}
