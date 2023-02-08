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
  display: (e: IPost, i: number) => JSX.Element;
}

export default function PostBox({
  posts,
  onIntersect,
  onChange,
  onRefresh,
  changeListener,
  display,
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
        <AnimatePresence initial={false}>{posts.map(display)}</AnimatePresence>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
