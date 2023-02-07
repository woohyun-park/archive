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

export default function Feed() {
  const { curUser } = useUser();
  const { posts, filteredPosts, getPosts, getFilteredPosts } = useFeed();
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => {
      tag.length === 0 && getPosts(curUser.id, "load");
    },
    handleChange: () => {},
    changeListener: posts,
  });
  const router = useRouter();
  const [curPosts, setCurPosts] = useState(posts);
  const { scroll } = useScrollSave();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [resetRefresh, setResetRefresh] = useState<boolean | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [tag, setTag] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (router.query.refresh) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        handleRefresh();
      } else {
        window.scrollTo(0, scroll[router.pathname]);
      }
    }, 10);
  }, []);

  useEffect(() => {
    setCurPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (resetRefresh === null) return;
    getPosts(curUser.id, "refresh").then(() => setRefreshLoading(false));
  }, [resetRefresh]);

  useEffect(() => {
    setFilterLoading(true);
  }, [tag]);

  useEffect(() => {
    async function filterPosts() {
      if (tag.length === 0) {
        setCurPosts(posts);
      } else {
        await getFilteredPosts(curUser.id, tag);
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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 pb-2 mt-16 border-b-8 border-gray-4f">
          <h1 className="title-logo">archive</h1>
          <div className="flex items-center justify-center">
            <IconBtn icon="alarm" onClick={() => router.push("/alarm")} />
            <ProfileImg user={curUser} />
          </div>
        </div>
        <FilterAndRefresh tag={tag} setTag={setTag} onRefresh={handleRefresh} />
        <Loader isVisible={refreshLoading || filterLoading} />
        <AnimatePresence initial={false}>
          {curPosts.map((e, i) => (
            <>
              <FeedPost post={e} />
              {tag.length === 0 && i === curPosts.length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
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
