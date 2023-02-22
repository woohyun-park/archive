import React, { Children, useEffect } from "react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IPost } from "../libs/custom";
import Loader from "./Loader";
import PostBox from "./PostBox";
import WrapRefreshAndLoad from "./wrappers/WrapLink copy";

export interface IPagePostColTwoProps {
  posts: IPost[];
  onIntersect: () => void;
  onChange: () => void;
  onRefresh: () => Promise<any>;
  changeListener: any;
  isLast: boolean;
}

export default function PagePostColTwo({
  posts,
  onIntersect,
  onChange,
  onRefresh,
  changeListener,
  isLast,
}: IPagePostColTwoProps) {
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });

  // useEffect(() => {
  //   document.querySelector(".ptr")?.setAttribute("style", "overflow:visible;");
  // }, []);

  return (
    <>
      <WrapRefreshAndLoad onRefresh={onRefresh} loading={loading}>
        <div className="grid grid-cols-2 mt-4 mb-4 gap-y-2 gap-x-2">
          {Children.toArray(
            posts.map((post, i) => (
              <>
                <PostBox type="titleAndTags" post={{ ...post, id: post.id }} />
                {!isLast && i === posts.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))
          )}
        </div>
      </WrapRefreshAndLoad>
      {/* <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={<Loader isVisible={true} />}
        refreshingContent={<Loader isVisible={true} />}
        isPullable={true}
        className="min-h-[50vh]"
      >
        <div className="grid grid-cols-2 mt-4 mb-4 gap-y-2 gap-x-2">
          {Children.toArray(
            posts.map((post, i) => (
              <>
                <PostBox type="titleAndTags" post={{ ...post, id: post.id }} />
                {!isLast && i === posts.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))
          )}
        </div>
      </PullToRefresh> */}
      {/* <Loader isVisible={loading} scrollIntoView={true} /> */}
    </>
  );
}
