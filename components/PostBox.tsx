import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IPost } from "../libs/custom";
import Motion from "../motions/Motion";
import FeedPost from "./FeedPost";
import Loader from "./Loader";

interface IPostBoxProps {
  posts: IPost[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<void>;
  changeListener: any;
  additionalRefCondition: boolean;
}

export default function PostBox({
  posts,
  onIntersect,
  onChange,
  onRefresh,
  changeListener,
  additionalRefCondition,
}: IPostBoxProps) {
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });
  return (
    <>
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<></>}
        refreshingContent={<Loader isVisible={true} />}
      >
        <AnimatePresence initial={false}>
          {posts.map((e, i) => (
            <>
              <FeedPost post={e} />
              {additionalRefCondition && i === posts.length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
              <hr className="w-full h-4 text-white bg-white" />
            </>
          ))}
        </AnimatePresence>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
