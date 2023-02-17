import React, { useEffect } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IAlarm, IComment, IPost } from "../libs/custom";
import PageFeed from "./PageFeed";
import Loader from "./Loader";
import PageSearch from "./PageSearch";
import PageAlarm from "./PageAlarm";
import PagePost from "./PagePost";

interface IPageProps {
  page: "feed" | "search" | "alarm" | "post";
  data: IPost[] | IAlarm[] | IComment[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<void>;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  changeListener: any;
  isLast?: boolean;
  minHeight?: string;
}

export default function Page({
  page,
  data,
  onIntersect,
  onChange,
  onRefresh,
  onClick,
  changeListener,
  isLast,
  minHeight = "50vh",
}: IPageProps) {
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
        isPullable={page === "post" ? false : true}
      >
        <div id="page_d1">
          {page === "feed" && (
            <PageFeed
              posts={data as IPost[]}
              setLastIntersecting={setLastIntersecting}
            />
          )}
          {page === "search" && (
            <PageSearch
              posts={data as IPost[]}
              isLast={isLast || false}
              setLastIntersecting={setLastIntersecting}
            />
          )}
          {page === "alarm" && (
            <PageAlarm
              alarms={data as IAlarm[]}
              isLast={isLast || false}
              setLastIntersecting={setLastIntersecting}
            />
          )}
          {page === "post" && (
            <PagePost
              comments={data as IComment[]}
              isLast={isLast || false}
              onClick={
                onClick || function (e: React.MouseEvent<HTMLDivElement>) {}
              }
              setLastIntersecting={setLastIntersecting}
            />
          )}
        </div>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
      <style jsx>
        {`
          #page_d1 {
            min-height: ${minHeight};
          }
        `}
      </style>
    </>
  );
}
