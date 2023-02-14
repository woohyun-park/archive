import { AnimatePresence } from "framer-motion";
import { Children, useEffect } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IAlarm, IPost } from "../libs/custom";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import Box from "./Box";
import FeedPost from "./FeedPost";
import Loader from "./Loader";

interface IInfinitePageProps {
  page: "feed" | "search" | "alarm";
  data: IPost[] | IAlarm[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<void>;
  changeListener: any;
  additionalCondition?: boolean;
}

export default function InfinitePage({
  page,
  data,
  onIntersect,
  onChange,
  onRefresh,
  changeListener,
  additionalCondition,
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
        </>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
