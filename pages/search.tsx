import { SIZE } from "../libs/custom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from "next/link";
import WrapMotion from "../components/wrappers/WrapMotion";
import { useSearch } from "../stores/useSearch";
import { useEffect } from "react";
import Page from "../components/Page";
import { useRouter } from "next/router";
import { useStatus } from "../stores/useStatus";
import { useGlobal } from "../hooks/useGlobal";
import { useModal } from "../stores/useModal";

export default function Search() {
  const { posts, isLast } = useSearch();
  const { scroll, setScroll } = useStatus();
  const { getSearch } = useGlobal();
  const { setModalLoader } = useModal();

  const router = useRouter();
  useEffect(() => {
    async function init() {
      if (scroll[router.asPath] === undefined) {
        await getSearch("init");
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        scrollTo(0, scroll[router.asPath]);
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
          data={posts}
          onIntersect={async () => {
            await getSearch("load");
          }}
          onChange={() => {}}
          onRefresh={async () => {
            await getSearch("refresh");
          }}
          changeListener={posts}
          isLast={isLast}
        />
      </WrapMotion>
      <div className="mb-24"></div>
    </>
  );
}
