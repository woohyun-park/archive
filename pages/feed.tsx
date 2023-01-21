import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Feed() {
  const { gFeed, gPage } = useStore();
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // TODO: 뒤로가기 시 이전 스크롤 유지
  const { setLastIntersecting } = useInfiniteScroll("feed");

  useEffect(() => {
    if (initLoading) return;
    setLoading(true);
  }, [gPage]);

  useEffect(() => {
    if (initLoading && gFeed.posts.length !== 0) {
      setInitLoading(false);
    } else if (loading && gFeed.posts.length !== 0) {
      setLoading(false);
    }
  }, [gFeed]);

  return (
    <>
      <h1 className="title-page">피드</h1>
      {initLoading && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-screen h-screen">
          <Loader />
        </div>
      )}
      {gFeed.posts.length !== 0 && (
        <>
          {gFeed.posts.map((post, i) => {
            return (
              <>
                <PostFeed
                  post={post}
                  user={post.author || null}
                  key={post.id}
                />
                <div ref={setLastIntersecting}></div>
              </>
            );
          })}
        </>
      )}
      {loading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
}
