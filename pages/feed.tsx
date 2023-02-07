import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { IUser, SIZE } from "../libs/custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useFeed } from "../stores/useFeed";
import { AnimatePresence } from "framer-motion";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";
import FeedPost from "../components/FeedPost";
import { HiOutlineBell } from "react-icons/hi2";
import ProfileImg from "../components/atoms/ProfileImg";
import IconInput from "../components/atoms/IconInput";
import IconBtn from "../components/atoms/IconBtn";
import { useTag } from "../hooks/useTag";
import FormTag from "../components/atoms/FormTag";
import { motion } from "framer-motion";
import { fadeVariants } from "../libs/motionLib";
import { db, getDataByRef } from "../apis/firebase";
import {
  collection,
  doc,
  DocumentData,
  orderBy,
  Query,
  query,
  where,
} from "firebase/firestore";
import { getPostsByQuery } from "../stores/useFeedHelper";
import Tag from "./tag/[tag]";

export default function Feed() {
  const { curUser } = useUser();
  const { posts, getPosts } = useFeed();
  const [curPosts, setCurPosts] = useState(posts);
  const router = useRouter();
  const { scroll } = useScrollSave();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [resetRefresh, setResetRefresh] = useState<boolean | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => {
      tag.length === 0 && getPosts(curUser.id, "load");
    },
    handleChange: () => {},
    changeListener: posts,
  });

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

  function handleRefresh() {
    setRefreshLoading(true);
    setResetRefresh(!resetRefresh);
  }
  const { tag, tags, error, onChange, onDelete } = useTag();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFilterLoading(true);
  }, [tag]);

  useEffect(() => {
    async function filterPosts() {
      async function getFilteredPosts() {
        const id = curUser.id;
        const user = await getDataByRef<IUser>(doc(db, "users", id));
        const q = query(
          collection(db, "posts"),
          where("uid", "in", [...user.followings, id]),
          where("tags", "array-contains", tag),
          orderBy("createdAt", "desc")
        );
        return await getPostsByQuery(q);
      }
      console.log(tag.length);
      if (tag.length === 0) {
        setCurPosts(posts);
      } else {
        const [snap, posts] = await getFilteredPosts();
        setCurPosts(posts);
      }
      setFilterLoading(false);
    }
    filterPosts();
  }, [filterLoading]);

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
                ? "z-10 scale-75 duration-100 ease-in-out absolute top-4"
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
              className="absolute z-10 top-4 right-6 hover:cursor-pointer"
              onClick={() => setIsOpen(false)}
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

          {
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="feed_input"
                  className="top-0 z-0 w-full"
                  variants={fadeVariants}
                >
                  <FormTag
                    tag={tag}
                    tags={tags}
                    error={error}
                    onChange={onChange}
                    onDelete={onDelete}
                    style="padding-left: 1.5rem; width: 100%; margin-left: 0;"
                    orderFirst="input"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          }
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
