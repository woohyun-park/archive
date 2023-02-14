import { AnimatePresence } from "framer-motion";
import React, { Children, useEffect } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IAlarm, IComment, IPost } from "../libs/custom";
import Motion from "../motions/Motion";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import Box from "./Box";
import Comment from "./Comment";
import FeedPost from "./FeedPost";
import Loader from "./Loader";

interface IInfinitePageProps {
  page: "feed" | "search" | "alarm" | "post";
  data: IPost[] | IAlarm[] | IComment[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<void>;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  changeListener: any;
  isLast?: boolean;
}

export default function InfinitePage({
  page,
  data,
  onIntersect,
  onChange,
  onRefresh,
  onClick,
  changeListener,
  isLast,
}: IInfinitePageProps) {
  useEffect(() => {
    document.querySelector(".ptr")?.setAttribute("style", "overflow:visible;");
  }, []);
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
        refreshingContent={<Loader isVisible={true} />}
      >
        <>
          {page === "feed" && (
            <AnimatePresence>
              <>
                {data.map((e, i) => (
                  <>
                    <FeedPost post={e as IPost} />
                    {i === data.length - 1 && (
                      <div ref={setLastIntersecting}></div>
                    )}
                    <hr className="w-full h-4 text-white bg-white" />
                  </>
                ))}
              </>
            </AnimatePresence>
          )}
          {page === "search" && (
            <div
              className={
                data.length !== 0
                  ? "grid grid-cols-3 mt-4 mb-4 gap-y-2 gap-x-2"
                  : ""
              }
            >
              {Children.toArray(
                data.map((e, i) => (
                  <>
                    <div>
                      <Box
                        post={{ ...(e as IPost), id: e.id }}
                        includeTitle={true}
                        includeTag={true}
                        style="font-size: 1rem;"
                      ></Box>
                    </div>
                    {i === data.length - 1 && (
                      <div ref={setLastIntersecting}></div>
                    )}
                  </>
                ))
              )}
            </div>
          )}
          {page === "alarm" && (
            <>
              {data.map((e, i) => {
                const alarm = e as IAlarm;
                return (
                  <>
                    {alarm.type === "like" && <AlarmLike alarm={alarm} />}
                    {alarm.type === "comment" && <AlarmComment alarm={alarm} />}
                    {alarm.type === "follow" && <AlarmFollow alarm={alarm} />}
                    {i === data.length - 1 && (
                      <div ref={setLastIntersecting}></div>
                    )}
                  </>
                );
              })}
            </>
          )}
          {page === "post" && (
            <AnimatePresence>
              {data.map((e, i) => {
                const comment = e as IComment;
                return (
                  <div key={comment.id}>
                    <Comment comment={comment} onClick={onClick} />
                    {!isLast && i === data.length - 1 && (
                      <div ref={setLastIntersecting}></div>
                    )}
                  </div>
                );
              })}
            </AnimatePresence>
          )}
        </>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
