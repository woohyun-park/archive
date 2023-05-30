import React, { Children } from "react";
import { WrapMotionFade, WrapMotionFloat } from "components/wrappers/motion";

import { IInfiniteScroll } from "consts/infiniteScroll";
import { ITag } from "apis/def";
import WrapPullToRefresh from "../wrappers/WrapPullToRefresh";

type Props = {
  infiniteScroll: IInfiniteScroll;

  lastPage?: React.ReactNode;
  className?: string;
  onClick?: (tag: ITag) => void;
  isPullable?: boolean;
};

export default function InfiniteTags({
  infiniteScroll,
  lastPage,
  className,
  onClick,
  isPullable = true,
}: Props) {
  const { data, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } =
    infiniteScroll;

  return (
    <WrapMotionFade className={className}>
      <WrapPullToRefresh
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage || false}
        isFetchingNextPage={isFetchingNextPage}
        lastPage={lastPage}
        isPullable={isPullable}
      >
        <>
          {Children.toArray(
            data.map((tag) => {
              return (
                <WrapMotionFloat
                  className="flex items-center mx-4 my-2 hover:cursor-pointer"
                  onClick={() => onClick && onClick(tag)}
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-2 text-xl rounded-full bg-gray-3 text-bold">
                    #
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">
                      #{tag.name}
                    </div>
                    <div className="w-full overflow-hidden text-xs whitespace-pre-wrap -translate-y-[2px] text-gray-1 text-ellipsis">
                      게시물 {tag.tags.length}개
                    </div>
                  </div>
                </WrapMotionFloat>
              );
            })
          )}
        </>
      </WrapPullToRefresh>
    </WrapMotionFade>
  );
}
