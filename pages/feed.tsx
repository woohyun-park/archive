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
import FilterAndRefresh from "../components/FilterAndRefresh";
import { debounce } from "lodash";

export default function Feed() {
  const { curUser } = useUser();
  const {
    posts,
    filteredPosts,
    getPosts,
    getFilteredPosts,
    keyword,
    setKeyword,
  } = useFeed();
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => {
      keyword.length === 0 && getPosts(curUser.id, "load");
    },
    handleChange: () => {},
    changeListener: posts,
  });
  const router = useRouter();
  const [curPosts, setCurPosts] = useState(
    filteredPosts.length === 0 ? posts : filteredPosts
  );
  const { scroll } = useScrollSave();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [resetRefresh, setResetRefresh] = useState<boolean | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("1");
    setTimeout(() => {
      if (router.query.refresh) {
        console.log("1-1");
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        handleRefresh();
      } else {
        console.log("1-2");
        window.scrollTo(0, scroll[router.pathname]);
      }
    }, 10);
  }, []);

  useEffect(() => {
    console.log("2");
    filteredPosts.length === 0
      ? setCurPosts(posts)
      : setCurPosts(filteredPosts);
  }, [posts]);

  useEffect(() => {
    console.log("3");
    if (resetRefresh === null) return;
    console.log("3-1");
    getPosts(curUser.id, "refresh").then(() => setRefreshLoading(false));
  }, [resetRefresh]);

  useEffect(() => {
    console.log("4", keyword, filteredPosts, resetRefresh);
    debounce(() => {
      console.log("4-1");
      resetFilter !== null && setFilterLoading(true);
    }, 500)();
  }, [keyword]);

  useEffect(() => {
    console.log("5");
    async function filterPosts() {
      if (keyword.length === 0) {
        console.log("5-1");
        setCurPosts(posts);
      } else {
        console.log("5-2");
        await getFilteredPosts(curUser.id, keyword);
        setCurPosts(filteredPosts);
      }
      setFilterLoading(false);
    }
    filterPosts();
  }, [filterLoading]);

  function handleRefresh() {
    setRefreshLoading(true);
    setResetRefresh(!resetRefresh);
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.value.slice(e.target.value.length - 1) !== " ") {
      setKeyword(e.target.value);
      setResetFilter(!resetFilter);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pb-2 mt-16 border-b-8 border-gray-4f">
        <h1 className="title-logo">archive</h1>
        <div className="flex items-center justify-center">
          <IconBtn icon="alarm" onClick={() => router.push("/alarm")} />
          <ProfileImg user={curUser} />
        </div>
      </div>
      <FilterAndRefresh
        onRefresh={handleRefresh}
        onChange={handleChange}
        onCancel={() => {
          setKeyword("");
          setResetFilter(!resetFilter);
        }}
        keyword={keyword}
      />
      <Loader isVisible={refreshLoading || filterLoading} />
      <AnimatePresence initial={false}>
        {curPosts.map((e, i) => (
          <>
            <FeedPost post={e} />
            {keyword.length === 0 && i === curPosts.length - 1 && (
              <div ref={setLastIntersecting}></div>
            )}
            <hr className="w-full h-2 text-gray-4f bg-gray-4f" />
          </>
        ))}
      </AnimatePresence>
      <Loader isVisible={loading} scrollIntoView={true} />
      <div className="mb-24"></div>
    </div>
  );
}
