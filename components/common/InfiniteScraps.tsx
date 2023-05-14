import { IDict, IScrap } from "apis/def";
import React, { Children } from "react";
import { WrapMotionFade, WrapMotionFloat } from "components/wrappers/motion";

import BtnIcon from "components/atoms/BtnIcon";
import { IInfiniteScroll } from "consts/infiniteScroll";
import WrapPullToRefresh from "../wrappers/WrapPullToRefresh";
import { useCustomRouter } from "hooks";

type Props = {
  infiniteScroll: IInfiniteScroll;

  lastPage?: React.ReactNode;
  className?: string;
  isPullable?: boolean;
};

export default function InfiniteScraps({
  infiniteScroll,
  lastPage,
  className,
  isPullable = true,
}: Props) {
  const router = useCustomRouter();
  const { data, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } =
    infiniteScroll;

  function formatScraps(scraps: IScrap[]) {
    const formattedScrap: IDict<IScrap[]> = {};
    scraps.forEach((scrap) =>
      formattedScrap[scrap.cont]
        ? formattedScrap[scrap.cont].push(scrap)
        : (formattedScrap[scrap.cont] = [scrap])
    );
    return Object.values(formattedScrap);
  }

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
            formatScraps(data).map((scrap, i) => {
              const cont = scrap[0].cont;
              const uid = scrap[0].uid;
              return (
                <WrapMotionFloat
                  className="flex items-center mx-4 my-2 hover:cursor-pointer"
                  onClick={() => router.push(`/profile/${uid}/scraps/${cont}`)}
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-2 text-xl rounded-full bg-gray-3 text-bold">
                    <BtnIcon icon="scrap" size={"16px"} stroke="2" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">{cont}</div>
                    <div className="w-full overflow-hidden text-xs whitespace-pre-wrap -translate-y-[2px] text-gray-1 text-ellipsis">
                      게시물 {scrap.length}개
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
