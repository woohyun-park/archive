import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useFeed } from "../stores/useFeed";
import { AnimatePresence } from "framer-motion";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";
import FeedPost from "../components/FeedPost";
import ProfileImg from "../components/atoms/ProfileImg";
import IconBtn from "../components/atoms/IconBtn";
import IconInput from "../components/atoms/IconInput";
import { debounce } from "lodash";
import { useKeyword } from "../stores/useKeyword";
import PullToRefresh from "react-simple-pull-to-refresh";

export default function Feed() {
  const router = useRouter();
  const { curUser } = useUser();
  const { posts, filteredPosts, getPosts, getFilteredPosts } = useFeed();
  const { keywords, setKeywords } = useKeyword();
  const keyword = keywords[router.pathname] || "";
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => keyword.length === 0 && getPosts(curUser.id, "load"),
    handleChange: () => {},
    changeListener: posts,
  });
  const [curPosts, setCurPosts] = useState(
    filteredPosts.length === 0 ? posts : filteredPosts
  );
  const { scroll } = useScrollSave();
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (router.query.refresh) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setFilterLoading(true);
        // handleRefresh();
      } else {
        window.scrollTo(0, scroll[router.pathname]);
      }
    }, 10);
  }, []);

  useEffect(() => {
    filteredPosts.length === 0
      ? setCurPosts(posts)
      : setCurPosts(filteredPosts);
  }, [posts]);

  useEffect(() => {
    debounce(() => {
      resetFilter !== null && setFilterLoading(true);
    }, 500)();
  }, [keyword]);

  useEffect(() => {
    async function filterPosts() {
      if (keyword.length === 0) {
        await getPosts(curUser.id, "refresh");
        setCurPosts(posts);
      } else {
        await getFilteredPosts(curUser.id, keyword);
        setCurPosts(filteredPosts);
      }
      setFilterLoading(false);
    }
    filterPosts();
  }, [filterLoading]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.value.slice(e.target.value.length - 1) !== " ") {
      setKeywords(router.pathname, e.target.value);
      setResetFilter(!resetFilter);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1 className="title-logo">archive</h1>
        <div className="flex items-center justify-center">
          <IconBtn icon="alarm" onClick={() => router.push("/alarm")} />
          <ProfileImg user={curUser} />
        </div>
      </div>
      <IconInput
        icon="filter"
        onChange={handleChange}
        onDelete={() => {
          setKeywords(router.pathname, "");
          setResetFilter(!resetFilter);
        }}
        keyword={keyword}
        placeholder={"찾고싶은 태그를 입력해보세요!"}
        style="margin-left: 1rem; margin-right: 1rem;"
      />
      <Loader isVisible={filterLoading} />
      <PullToRefresh
        onRefresh={async () => {
          await getPosts(curUser.id, "refresh");
        }}
        pullingContent={<></>}
        refreshingContent={<Loader isVisible={true} />}
      >
        <AnimatePresence initial={false}>
          {curPosts.map((e, i) => (
            <>
              <FeedPost post={e} />
              {keyword.length === 0 && i === curPosts.length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
              <hr className="w-full h-4 text-white bg-white" />
            </>
          ))}
        </AnimatePresence>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
      <div className="mb-24"></div>
    </div>
  );
}
