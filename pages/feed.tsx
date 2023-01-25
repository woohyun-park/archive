import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "../apis/zustand";
import GridPost from "../components/GridPost";

export default function Feed() {
  const { gFeed, gScroll, gSetPage, gCurUser, gPage, gSetFeed } = useStore();
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, gScroll[router.pathname]);
    }, 10);
  }, []);

  return (
    <>
      <div>
        <h1 className="title-page">피드</h1>
        <GridPost
          posts={gFeed.posts}
          handleIntersect={() => gSetPage("feed", "post", gPage.feed.post + 1)}
          handleChange={() => gSetFeed(gCurUser.id, gPage.feed.post)}
          changeListener={gPage.feed.post}
          option={{
            includeProfile: true,
            preserveScroll: true,
          }}
        />
        <div className="mb-24"></div>
      </div>
    </>
  );
}
