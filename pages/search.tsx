import { IPost, SIZE } from "../libs/custom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";
import WrapMotion from "../components/wrappers/WrapMotion";
import { useEffect } from "react";
import Page from "../components/Page";
import { useRouter } from "next/router";
import { useStatus } from "../stores/useStatus";
import { useCache } from "../stores/useCache";
import { useCachedPage } from "../hooks/useCachedPage";

export default function Search() {
  const router = useRouter();

  const { scroll, setModalLoader } = useStatus();
  const { data, isLast, fetchPosts } = useCachedPage("posts");

  const path = router.asPath;

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        fetchPosts && (await fetchPosts("init", path));
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        scrollTo(0, scroll[path]);
      }
    }
    init();
  }, []);

  return (
    <>
      <WrapMotion type="fade">
        <Link href="/search-modal">
          <div className="flex">
            <div className="flex items-center w-full px-[0.25rem] py-[0.375rem] my-[0.75rem] mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiMagnifyingGlass size={SIZE.iconSm} className="scale-75" />
            </div>
          </div>
        </Link>
        <Page
          page="search"
          data={data}
          onIntersect={async () => {
            fetchPosts && (await fetchPosts("load", path));
          }}
          onChange={() => {}}
          onRefresh={async () => {
            fetchPosts && (await fetchPosts("refresh", path));
          }}
          changeListener={data}
          isLast={isLast}
        />
      </WrapMotion>
      <div className="mb-24"></div>
    </>
  );
}
