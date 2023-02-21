import React, { useEffect } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IAlarm, IComment, IPost, IUser } from "../libs/custom";
import PageFeed from "./PageFeed";
import Loader from "./Loader";
import PageSearch from "./PageSearch";
import PageAlarm from "./PageAlarm";
import PagePost from "./PagePost";
import PageUser from "./PageUser";
import { IWrapMotionType } from "./wrappers/WrapMotion";

export interface IPageProps {
  page: "feed" | "search" | "alarm" | "post" | "user";
  data: IPost[] | IAlarm[] | IComment[] | IUser[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<void>;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  changeListener: any;
  isLast?: boolean;
  minHeight?: string;
  wrapMotionType?: IWrapMotionType;
  key?: string;
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
        className="min-h-[50vh]"
      >
        <>
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
          {page === "user" && (
            <PageUser
              users={data as IUser[]}
              isLast={isLast || false}
              setLastIntersecting={setLastIntersecting}
            />
          )}
        </>
      </PullToRefresh>
      <Loader isVisible={loading} scrollIntoView={true} />
    </>
  );
}
