import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { SIZE } from "../libs/custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useFeed } from "../stores/useFeed";
import { AnimatePresence } from "framer-motion";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";
import FeedPost from "../components/FeedPost";
import { HiOutlineBell } from "react-icons/hi2";
import ProfileImg from "../components/atoms/ProfileImg";
import IconInput from "../components/atoms/IconInput";

export default function Feed() {
  const { curUser } = useUser();
  const { posts, getPosts } = useFeed();
  const router = useRouter();
  const { scroll } = useScrollSave();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [resetRefresh, setResetRefresh] = useState<boolean | null>(null);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => {
      getPosts(curUser.id, "load");
    },
    handleChange: () => {},
    changeListener: posts,
  });

  useEffect(() => {
    router.beforePopState(() => {
      return true;
    });
    setTimeout(() => {
      if (router.query.refresh) {
        window.scrollTo(0, 0);
        handleRefresh();
      } else {
        window.scrollTo(0, scroll[router.pathname]);
      }
    }, 10);
  }, []);

  useEffect(() => {
    if (resetRefresh === null) return;
    getPosts(curUser.id, "refresh").then(() => setRefreshLoading(false));
  }, [resetRefresh]);

  function handleRefresh() {
    setRefreshLoading(true);
    setResetRefresh(!resetRefresh);
  }
  const [search, setSearch] = useState(false);
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 pb-2 mt-16 border-b-8 border-gray-4f">
          <h1 className="title-page">archive</h1>
          <div className="flex items-center justify-center">
            <HiOutlineBell
              size={SIZE.icon}
              className="mr-2 hover:cursor-pointer"
            />
            <ProfileImg user={curUser} />
          </div>
        </div>
        <div className="relative flex items-center px-4 py-2 border-b-2 border-dotted border-gray-4f">
          <IconInput
            icon="search"
            value={keyword}
            isOpen={search}
            onFocus={() => setSearch(true)}
            onBlur={() => {
              setSearch(false);
            }}
            onChange={(e) => setKeyword(e.target.value)}
            size={SIZE.iconSm}
            onCancelClick={() => {
              setSearch(false);
              setKeyword("");
            }}
            onRefreshClick={handleRefresh}
          />
        </div>
        <Loader isVisible={refreshLoading} />
        <AnimatePresence initial={false}>
          {posts.map((e, i) => (
            <>
              <FeedPost post={e} />
              {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
              <hr className="w-full h-2 text-gray-4f bg-gray-4f" />
            </>
          ))}
        </AnimatePresence>
        <Loader isVisible={loading} scrollIntoView={true} />
        <div className="mb-24"></div>
      </div>
    </>
  );
}
