import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Feed() {
  const { gFeed } = useStore();
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // TODO: 뒤로가기 시 이전 스크롤 유지
  const { page, setLastIntersecting } = useInfiniteScroll();

  useEffect(() => {
    if (initLoading) return;
    setLoading(true);
  }, [page]);

  useEffect(() => {
    console.log(gFeed);
    console.log("1", initLoading, loading);
    if (initLoading && gFeed.posts.length !== 0) {
      console.log("2", initLoading, loading);
      setInitLoading(false);
    } else if (loading && gFeed.posts.length !== 0) {
      console.log("2", initLoading, loading);
      setLoading(false);
    }
  }, [gFeed]);

  return (
    <>
      <>
        <h1>피드</h1>
        {initLoading && (
          <div className="loaderCont">
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
          <div className="loaderContBottom">
            <Loader />
          </div>
        )}
      </>

      <style jsx>
        {`
          .loaderCont {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
          }
          .loaderContBottom {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </>
  );
}
