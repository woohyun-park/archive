import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { IPost, IUser } from "../custom";

export default function Feed() {
  const { gCurUser, gPosts, gUsers, gSetPostsAndUsers } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gPosts.length !== 0) {
      setLoading(!loading);
    }
  }, [gPosts]);

  return (
    <>
      <h1>피드</h1>
      {loading ? (
        <div className="loaderCont">
          <Loader />
        </div>
      ) : (
        gPosts.map((post, i) => {
          return <PostFeed post={post} user={gUsers[i]} key={post.id} />;
        })
      )}

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
        `}
      </style>
    </>
  );
}
