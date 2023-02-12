import { AnimatePresence } from "framer-motion";
import { Children } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IPost } from "../libs/custom";
import Box from "./Box";
import FeedPost from "./FeedPost";
import Loader from "./Loader";

interface IPostBoxProps {
  type: "feed" | "search";
  posts: IPost[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<void>;
  changeListener: any;
  additionalRefCondition?: boolean;
}

export default function PostBox({
  type,
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
        pullingContent={<Loader isVisible={true} />}
        refreshingContent={<></>}
      >
        <>
          {type === "feed" && (
            <AnimatePresence>
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
          )}
          {type === "search" && (
            <div
              className={
                posts.length !== 0
                  ? "grid grid-cols-3 mt-4 mb-4 gap-y-2 gap-x-2"
                  : ""
              }
            >
              {Children.toArray(
                posts.map((e, i) => (
                  <>
                    <div>
                      <Box
                        post={{ ...e, id: e.id }}
                        includeTitle={true}
                        includeTag={true}
                        style="font-size: 1rem;"
                      ></Box>
                    </div>
                    {i === posts.length - 1 && (
                      <div ref={setLastIntersecting}></div>
                    )}
                  </>
                ))
              )}
            </div>
          )}
        </>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
