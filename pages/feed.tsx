import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStore } from "../apis/zustand";
import List from "../components/List";

export default function Feed() {
  const { gFeed, gScroll } = useStore();
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, gScroll.feed.post);
    }, 10);
  }, []);
  // window.onload(() => {});

  return (
    <>
      <div
      // onLoad={() => {
      //   setTimeout(() => {
      //     window.scrollTo(0, gScroll.feed.post);
      //   }, 500);
      // }}
      >
        <h1 className="title-page">피드</h1>
        <List data={gFeed.posts} type="post" route="feed" />
        <div className="mb-24"></div>
      </div>
    </>
  );
}
