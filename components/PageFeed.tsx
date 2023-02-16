import { AnimatePresence } from "framer-motion";
import { IPost } from "../libs/custom";
import Post from "./Post";

interface IPageFeedProps {
  posts: IPost[];
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageFeed({
  posts,
  setLastIntersecting,
}: IPageFeedProps) {
  return (
    <>
      <AnimatePresence>
        {posts.map((e, i) => (
          <div key={e.id}>
            <Post type="feed" post={e as IPost} />
            {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
            <hr className="w-full h-4 text-white bg-white" />
          </div>
        ))}
      </AnimatePresence>
    </>
  );
}
