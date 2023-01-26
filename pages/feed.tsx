import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import LinkScroll from "../components/LinkScroll";
import Loader from "../components/Loader";
import Action from "../components/Action";
import ProfileSmall from "../components/ProfileSmall";
import { IUser } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import MotionFloatList from "../motions/MotionFloatList";
import MotionFloat from "../motions/motionFloat";
import { arrayBuffer } from "stream/consumers";

export default function Feed() {
  const { gFeed, gScroll, gSetPage, gCurUser, gPage, gSetFeed } = useStore();
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, gScroll[router.pathname]);
    }, 10);
  }, []);
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: () => gSetPage("feed", "post", gPage.feed.post + 1),
    handleChange: () => gSetFeed(gCurUser.id, gPage.feed.post),
    changeListener: gPage.feed.post,
  });

  return (
    <>
      <div>
        <h1 className="title-page">피드</h1>
        {(() => {
          const result = [];
          const arr = [...gFeed.posts];
          while (arr.length !== 0) {
            const temp = arr.splice(0, 5);
            result.push(
              <MotionFloatList
                data={temp}
                callBack={(e, i) => (
                  <MotionFloat>
                    <LinkScroll key={i}>
                      <ProfileSmall
                        post={e}
                        user={e.author as IUser}
                        type="post"
                      />
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
                      {i === gFeed.posts.length - 1 && (
                        <div ref={setLastIntersecting}></div>
                      )}
                    </LinkScroll>
                  </MotionFloat>
                )}
                delayChildren={1}
                staggerChildren={1}
              />
            );
          }
          return result;
        })()}
        {/* <MotionFloatList
          data={gFeed.posts}
          callBack={(e, i) => (
            <MotionFloat>
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
                {i === gFeed.posts.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </LinkScroll>
            </MotionFloat>
          )}
          delayChildren={1}
          staggerChildren={1}
        /> */}
        {/* {gFeed.posts.map((e, i) => (
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
            {i === gFeed.posts.length - 1 && (
              <div ref={setLastIntersecting}></div>
            )}
          </LinkScroll>
        ))} */}
        <div className="flex justify-center"> {loading && <Loader />}</div>
        <div className="mb-24"></div>
      </div>
    </>
  );
}
