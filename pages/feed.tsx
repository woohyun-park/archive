import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import LinkScroll from "../components/LinkScroll";
import Loader from "../components/Loader";
import Action from "../components/Action";
import ProfileSmall from "../components/ProfileSmall";
import { IPost, IUser, SIZE } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import IconBtn from "../components/atoms/IconBtn";
import { feedStore } from "../apis/feedStore";
import { AnimatePresence, motion, Variants } from "framer-motion";

const variants: Variants = {
  initial: {
    transform: `translateY(16px)`,
    opacity: 0,
    transition: { duration: 0.33 },
  },
  animate: {
    transform: `translateY(0px)`,
    opacity: 1,
    transition: { duration: 0.33 },
  },
  exit: {
    transform: `translateY(-16px)`,
    opacity: 0,
    transition: { duration: 0.33 },
  },
};

export default function Feed() {
  const { gCurUser, gScroll } = useStore();
  const { posts, getPosts } = feedStore();
  const router = useRouter();
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [resetRefresh, setResetRefresh] = useState<boolean | null>(null);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => {
      getPosts(gCurUser.id, "load");
    },
    handleChange: () => {},
    changeListener: posts,
  });

  useEffect(() => {
    router.beforePopState(() => {
      return true;
    });
    setTimeout(() => {
      window.scrollTo(0, gScroll[router.pathname]);
    }, 10);
    if (router.query.refresh) {
      handleRefresh();
    }
  }, []);

  useEffect(() => {
    if (resetRefresh === null) return;
    getPosts(gCurUser.id, "refresh").then(() => setRefreshLoading(false));
  }, [resetRefresh]);

  const eachPost = (e: IPost, i: number) => (
    <LinkScroll key={e.id}>
      <ProfileSmall post={e} user={e.author as IUser} type="post" />
      <Box post={e} />
      <Action
        post={e}
        curUser={gCurUser}
        onCommentClick={() =>
          router.push(
            {
              pathname: `/post/${e.id}`,
              query: { isCommentFocused: true },
            },
            `/post/${e.id}`
          )
        }
      />
      {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
    </LinkScroll>
  );
  function handleRefresh() {
    setRefreshLoading(true);
    setResetRefresh(!resetRefresh);
  }

  return (
    <>
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="title-page">피드</h1>
          <IconBtn type="refresh" onClick={handleRefresh} />
        </div>
        <Loader isVisible={refreshLoading} />
        <AnimatePresence initial={false}>
          {posts.map((e, i) => (
            <motion.div
              key={e.id || ""}
              initial="initial"
              animate="animate"
              exit="exit"
              viewport={{ once: true, amount: 0.1 }}
              variants={variants}
            >
              {eachPost(e, i)}
            </motion.div>
          ))}
        </AnimatePresence>
        <Loader isVisible={loading} scrollIntoView={true} />
        <div className="mb-24"></div>
      </div>
    </>
  );
}
