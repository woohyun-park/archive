import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { IFetchQueryScraps } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IDict, IScrap, ITag, IUser } from "../libs/custom";
import { ICacheType } from "../stores/useCacheHelper";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";
import Cont from "./Cont";
import WrapMotion from "./wrappers/WrapMotion";
import BtnIcon from "./atoms/BtnIcon";
import WrapScroll from "./wrappers/WrapScroll";

export interface IPageScrapsProps {
  query: IFetchQueryScraps;
}

export default function PageScraps({ query }: IPageScrapsProps) {
  const router = useRouter();

  const cache = useCachedPage("scraps");
  const { setModalLoader } = useStatus();
  const { curUser } = useUser();

  const path = router.asPath;
  const keyword = (router.query.keyword as string) || "";
  const tag = (router.query.tag as string) || "";

  const scraps = cache.data as IScrap[];
  function onIntersect() {
    cache.fetchScraps && cache.fetchScraps("load", query, path);
  }
  function onChange() {}
  async function onRefresh() {
    cache.fetchScraps && cache.fetchScraps("refresh", query, path);
  }
  const changeListener = scraps;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        cache.fetchScraps && (await cache.fetchScraps("init", query, path));
      }
      setModalLoader(false);
    }
    init();
  }, []);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });

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
    <WrapRefreshAndLoad onRefresh={onRefresh} loading={loading}>
      {Children.toArray(
        formatScraps(scraps).map((scrap, i) => {
          const cont = scrap[0].cont;
          const uid = scrap[0].uid;
          return (
            <WrapMotion
              type="float"
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
            </WrapMotion>
          );
        })
      )}
    </WrapRefreshAndLoad>
  );
}
