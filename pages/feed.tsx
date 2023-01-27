import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { POST_PER_PAGE, useStore } from "../apis/zustand";
import Box from "../components/Box";
import LinkScroll from "../components/LinkScroll";
import Loader from "../components/Loader";
import Action from "../components/Action";
import ProfileSmall from "../components/ProfileSmall";
import { IPost, IUser, SIZE } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import MotionFloat from "../motions/motionFloat";
import { IoRefreshSharp } from "react-icons/io5";
import IconBtn from "../components/atoms/IconBtn";

export default function Feed() {
  const { gFeed, gScroll, gSetPage, gCurUser, gSetFeed, gStatus, gSetStatus } =
    useStore();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, gScroll[router.pathname]);
    }, 10);
  }, []);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => gSetFeed(gCurUser.id, false),
    handleChange: () => {},
    changeListener: null,
  });

  useEffect(() => {
    router.beforePopState(() => {
      gSetStatus({ ...gStatus, orchestra: gFeed.posts.length });
      return true;
    });
  }, []);

  const eachPost = (e: IPost, i: number) => (
    <LinkScroll key={i}>
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
      {i === gFeed.posts.length - 1 && <div ref={setLastIntersecting}></div>}
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
              gSetFeed(gCurUser.id, true);
            }}
          />
        </div>
        {gFeed.posts.map((e, i) =>
          i >= gStatus.orchestra ? (
            <MotionFloat key={i}>{eachPost(e, i)}</MotionFloat>
          ) : (
            <>{eachPost(e, i)}</>
          )
        )}
        <div className="flex justify-center"> {loading && <Loader />}</div>
        <div className="mb-24"></div>
      </div>
    </>
  );
}
