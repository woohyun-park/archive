import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { ITag, IUser } from "../libs/custom";
import { ICacheType } from "../stores/useCacheHelper";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import Profile from "./Profile";
import WrapMotion from "./wrappers/WrapMotion";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPageTagsProps {
  fetchType: ICacheType;
}

export default function PageTags({ fetchType = "tags" }: IPageTagsProps) {
  const router = useRouter();

  const cache = useCachedPage(fetchType);
  const { setModalLoader } = useStatus();
  const { curUser } = useUser();

  const path = router.asPath;
  const keyword = (router.query.keyword as string) || "";
  const tag = (router.query.tag as string) || "";

  const tags = cache.data as any[];
  function onIntersect() {
    if (fetchType === "tags") {
      cache.fetchTags && cache.fetchTags("load", path, keyword);
    }
  }
  function onChange() {}
  async function onRefresh() {
    if (fetchType === "tags") {
      cache.fetchTags && cache.fetchTags("refresh", path, keyword);
    }
  }
  const changeListener = tags;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        if (fetchType === "tags") {
          cache.fetchTags && (await cache.fetchTags("init", path, keyword));
        }
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

  return (
    <>
      <WrapRefreshAndLoad onRefresh={onRefresh} loading={loading}>
        {Children.toArray(
          tags.map((tag, i) => {
            return (
              <WrapMotion
                type="float"
                className="flex items-center mx-4 my-2 hover:cursor-pointer"
                onClick={() => router.push(`/tag/${tag.name}`)}
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
                {!isLast && i === tags.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </WrapMotion>
            );
          })
        )}
      </WrapRefreshAndLoad>
    </>
  );
}
