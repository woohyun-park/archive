import { useRouter } from "next/router";
import React, { Children, useEffect, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryTags } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { IDict, ITag } from "../apis/def";
import WrapMotion from "./wrappers/WrapMotion";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageTagsProps {
  query: IFetchQueryTags;
  as: string;
  isPullable?: boolean;
  paddingBottom?: string;
  displayWhenEmpty?: React.ReactNode;
}

export default function PageTags({
  query,
  as,
  isPullable = true,
  paddingBottom,
  displayWhenEmpty,
}: IPageTagsProps) {
  const router = useRouter();

  const { data, onRefresh, onFetchMore, canFetchMore } = useCachedPage(
    "tags",
    query,
    { as, isPullable }
  );

  const tags = data as any[];

  // type이 keyword일때와 uid일때 서버에서 가져오는 tags의 데이터가 조금 다르다
  // keyword일 경우 tagCont에서 {name: string, tags: tid[]}[]의 형태로 가져오는 반면,
  // uid일 경우 tag에서 uid로 필터하여 ITag[]의 형태로 가져오기 때문에 데이터를 일치시켜주는 작업이 필요하다
  function formatTags(tags: any[]) {
    if (tags.length == 0) return tags;
    // 만약 type이 uid라면 {name: string, tags: tid[]}[]의 형태로 변형하여 반환한다.
    if (query.type === "uid") {
      const result: IDict<any> = {};
      tags.forEach((tag: ITag) => {
        const name = tag.name;
        const tid = tag.id;
        if (result[name]) result[name].tags.push(tid);
        else result[name] = { name, tags: [tid] };
      });
      return Object.values(result);
    }
    // 만약 type이 keyword라면 그대로 반환한다.
    return tags;
  }

  return (
    <>
      <WrapPullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
        isPullable={isPullable}
      >
        {tags.length !== 0 ? (
          <>
            {Children.toArray(
              formatTags(tags).map((tag, i) => {
                return (
                  <WrapMotion
                    type="float"
                    className="flex items-center mx-4 my-2 hover:cursor-pointer"
                    onClick={() =>
                      query.type === "keyword"
                        ? router.push(`/tag/${tag.name}`)
                        : router.push(
                            `/profile/${query.value.uid}/tags/${tag.name}`
                          )
                    }
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
