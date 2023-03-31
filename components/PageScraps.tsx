import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { IFetchQueryScraps } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { IDict, IScrap, ITag, IUser } from "../apis/interface";
import WrapMotion from "./wrappers/WrapMotion";
import BtnIcon from "./atoms/BtnIcon";
import PullToRefresh from "react-simple-pull-to-refresh";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageScrapsProps {
  query: IFetchQueryScraps;
  paddingBottom?: string;
  displayWhenEmpty?: React.ReactNode;
}

export default function PageScraps({
  query,
  paddingBottom,
  displayWhenEmpty,
}: IPageScrapsProps) {
  const router = useRouter();

  const { data, onRefresh, onFetchMore, canFetchMore } = useCachedPage(
    "scraps",
    query
  );

  const scraps = data as IScrap[];

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
    <>
      <WrapPullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
      >
        {scraps.length !== 0 ? (
          <>
            {Children.toArray(
              formatScraps(scraps).map((scrap, i) => {
                const cont = scrap[0].cont;
                const uid = scrap[0].uid;
                return (
                  <WrapMotion
                    type="float"
                    className="flex items-center mx-4 my-2 hover:cursor-pointer"
                    onClick={() =>
                      router.push(`/profile/${uid}/scraps/${cont}`)
                    }
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
                  </WrapMotion>
                );
              })
            )}
          </>
        ) : (
          displayWhenEmpty
        )}
      </WrapPullToRefresh>
      <div className={paddingBottom} />
    </>
  );
}
