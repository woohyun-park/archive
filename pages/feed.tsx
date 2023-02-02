import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "../stores/useStore";
import Box from "../components/Box";
import WrapScroll from "../components/wrappers/WrapScroll";
import Loader from "../components/Loader";
import Action from "../components/Action";
import ProfileSmall from "../components/ProfileSmall";
import { getRoute, IUser, SIZE } from "../libs/custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import IconBtn from "../components/atoms/IconBtn";
import { useFeed } from "../stores/useFeed";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  fadeVariants,
  floatVariants,
  swipeRightVariants,
} from "../libs/motionLib";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";
import Link from "next/link";
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
      window.scrollTo(0, scroll[router.pathname]);
    }, 10);
    if (router.query.refresh) {
      handleRefresh();
    }
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

  const route = getRoute(router);

  return (
    <>
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
      <div className="relative flex items-center justify-between px-4 py-2 border-b-2 border-dotted border-gray-4f">
        {/* <IconBtn type="search" size={SIZE.iconSm} /> */}
        <IconInput
          type="search"
          onFocus={() => setSearch(true)}
          onBlur={() => setSearch(false)}
        />
        <AnimatePresence>
          {!search && (
            <motion.div
              key="refresh"
              className="absolute right-0 flex items-center justify-end mr-4 w-9 h-9"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeVariants}
            >
              <IconBtn
                type="refresh"
                size={SIZE.iconSm}
                onClick={handleRefresh}
              />
            </motion.div>
          )}
          {search && (
            <motion.div
              key="cancel"
              className="absolute right-0 flex items-center justify-end mr-4 text-sm w-9 h-9 hover:cursor-pointer"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeVariants}
            >
              취소
            </motion.div>
          )}
        </AnimatePresence>
        <div className="w-9 h-9"></div>
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
    </>
  );
}
