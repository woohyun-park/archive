import { AnimatePresence } from "framer-motion";
import { Children, useEffect, useRef } from "react";
import { IPost } from "../libs/custom";
import Post from "./Post";
import { IWrapMotionType } from "./wrappers/WrapMotion";

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
        {Children.toArray(
          posts.map((e, i) => (
            <div>
              <Post type="feed" post={e as IPost} />
              {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
              <hr className="w-full h-4 text-white bg-white" />
            </div>
          ))
        )}
      </AnimatePresence>
    </>
  );
}
