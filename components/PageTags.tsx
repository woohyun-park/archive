import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IDict, ITag } from "../libs/custom";
import { IFetchQueryTags } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";
import WrapMotion from "./wrappers/WrapMotion";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPageTagsProps {
  query: IFetchQueryTags;
  as: string;
}

export default function PageTags({ query, as }: IPageTagsProps) {
  const router = useRouter();

  const cache = useCachedPage("tags", as);
  const { setModalLoader } = useStatus();

  const path = router.asPath;

  const tags = cache.data as any[];
  function onIntersect() {
    cache.fetchTags && cache.fetchTags("load", query, path, as);
  }
  function onChange() {}
  async function onRefresh() {
    cache.fetchTags && cache.fetchTags("refresh", query, path, as);
  }
  const changeListener = tags;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        cache.fetchTags && (await cache.fetchTags("init", query, path, as));
      }
      setModalLoader(false);
    }
    init();
  }, []);

  function formatTags(tags: any[]) {
    console.log(tags);
    if (tags.length == 0) return tags;
    if (tags[0].id) {
      const result: IDict<any> = {};
      tags.forEach((tag: ITag) => {
        const name = tag.name;
        const tid = tag.id;
        if (result[name]) result[name].tags.push(tid);
        else result[name] = { name, tags: [tid] };
      });
      return Object.values(result);
    }
    return tags;
  }

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });

  return (
    <>
      <WrapRefreshAndLoad onRefresh={onRefresh} loading={loading}>
        {Children.toArray(
          formatTags(tags).map((tag, i) => {
            return (
              <WrapMotion
                type="float"
                className="flex items-center mx-4 my-2 hover:cursor-pointer"
                onClick={() => {
                  if (query.type === "keyword") router.push(`/tag/${tag.name}`);
                  /* query.type === "uid"*/ else
                    router.push(`/profile/${query.value.uid}/${tag.name}`);
                }}
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
