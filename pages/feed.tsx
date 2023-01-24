import { useStore } from "../apis/zustand";
import List from "../components/List";

export default function Feed() {
  const { gFeed, gPage } = useStore();

  return (
    <>
      <h1 className="title-page">피드</h1>
      <List data={gFeed.posts} type="post" route="feed" />
      <div className="mb-24"></div>
    </>
  );
}
