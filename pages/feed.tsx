import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "../apis/zustand";
import LinkScroll from "../components/LinkScroll";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

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
        {gFeed.posts.map((e, i) => (
          <LinkScroll key={i}>
            <PostFeed post={e} user={e.author || null} key={e.id} />
            {i === gFeed.posts.length - 1 && (
              <div ref={setLastIntersecting}></div>
            )}
          </LinkScroll>
        ))}
        <div className="flex justify-center"> {loading && <Loader />}</div>
        <div className="mb-24"></div>
      </div>
    </>
  );
}
