import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { IPost, IUser } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function Feed() {
  const { gCurUser, gPosts, gUsers, gSetPostsAndUsers } = useStore();
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const { page, setLastIntersecting } = useInfiniteScroll();

  useEffect(() => {
    if (initLoading && gPosts.length !== 0) {
      setInitLoading(false);
    } else if (gPosts.length !== 0 && loading) {
      setLoading(false);
    }
  }, [gPosts]);
  useEffect(() => {
    if (initLoading) return;
    setLoading(true);
  }, [page]);

  return (
    <>
      <>
        <h1>피드</h1>
        {initLoading && (
          <div className="loaderCont">
            <Loader />
          </div>
        )}
        {gPosts.length !== 0 && (
          <>
            {gPosts.map((post, i) => {
              return (
                <>
                  <PostFeed post={post} user={gUsers[i]} key={post.id} />
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
