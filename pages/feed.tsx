import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "../apis/zustand";
import List from "../components/List";
import ListPost from "../components/ListPost";

export default function Feed() {
  const { gFeed, gScroll, gSetPage, gCurUser, gPage, gSetFeed } = useStore();
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, gScroll[router.pathname]);
      console.log("scroll!", gScroll[router.pathname], router.pathname);
    }, 10);
  }, []);

  return (
    <>
      <div>
        <h1 className="title-page">피드</h1>
        {/* <List data={gFeed.posts} type="post" route="feed" /> */}
        <ListPost
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
