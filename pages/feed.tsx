import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { SIZE } from "../libs/custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useFeed } from "../stores/useFeed";
import { AnimatePresence } from "framer-motion";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";
import FeedPost from "../components/FeedPost";
import ProfileImg from "../components/atoms/ProfileImg";
import IconBtn from "../components/atoms/IconBtn";
import { motion } from "framer-motion";
import { fadeVariants } from "../libs/motionLib";
import Input from "../components/atoms/Input";

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
  const [isOpen, setIsOpen] = useState(false);

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setTag(e.target.value);
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
        <div className="relative flex items-center px-4 py-2 border-b-2 border-dotted border-gray-4f">
          <div
            className={
              isOpen
                ? "z-10 left-[1.125rem] scale-75 duration-100 ease-in-out absolute top-[1.125rem]"
                : "z-10 duration-100 ease-in-out"
            }
          >
            <IconBtn
              icon="filter"
              size={SIZE.iconSm}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
          {isOpen ? (
            <div
              className="absolute z-10 top-[1.125rem] right-6 hover:cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                setTag("");
              }}
            >
              취소
            </div>
          ) : (
            <IconBtn
              icon="refresh"
              size={SIZE.iconSm}
              onClick={handleRefresh}
            />
          )}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="feed_input"
                className="top-0 z-0 w-full"
                variants={fadeVariants}
              >
                <Input
                  type="text"
                  value={tag}
                  onChange={handleChange}
                  style="padding-left: 1.5rem"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
