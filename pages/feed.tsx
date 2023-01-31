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
import MotionFloat from "../motions/motionFloat";
import IconBtn from "../components/atoms/IconBtn";
import { feedStore } from "../apis/feedStore";

export default function Feed() {
  const { gCurUser } = useStore();
  const {
    posts,
    orchestra,
    scroll,
    getPosts,
    setOrchestra,
    setScroll,
    hidden,
  } = feedStore();
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
      setOrchestra(posts);
      return true;
    });
    setTimeout(() => {
      window.scrollTo(0, scroll);
    }, 10);
  }, []);

  useEffect(() => {
    if (resetRefresh === null) return;
    getPosts(gCurUser.id, "refresh").then(() => setRefreshLoading(false));
  }, [resetRefresh]);

  const eachPost = (e: IPost, i: number) => (
    <LinkScroll key={e.id} isVisible={!hidden.has(e.id || "")}>
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

  return (
    <>
      <div>
        <div className="flex items-baseline justify-between">
          <h1 className="title-page">피드</h1>
          <IconBtn
            type="refresh"
            onClick={() => {
              setRefreshLoading(true);
              setResetRefresh(!resetRefresh);
            }}
          />
        </div>
        <Loader isVisible={refreshLoading} />
        {posts.map((e, i) =>
          !orchestra.has(e.id || "") ? (
            <MotionFloat key={e.id || ""}>{eachPost(e, i)}</MotionFloat>
          ) : (
            <>{eachPost(e, i)}</>
          )
        )}
        <Loader isVisible={loading} scrollIntoView={true} />
        <div className="mb-24"></div>
      </div>
    </>
  );
}
