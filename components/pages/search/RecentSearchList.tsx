import { Children, RefObject, useRef } from "react";
import {
  WrapMotionAccordion,
  WrapMotionFade,
} from "components/wrappers/motion";

import { AnimatePresence } from "framer-motion";
import BtnIcon from "components/atoms/BtnIcon";
import { SIZE } from "apis/def";
import { useUser } from "providers/UserProvider";

type Props = {
  keyword: string;
  searchBarRef: RefObject<HTMLDivElement>;
  onSearch: () => void;
};

export default function RecentSearchList({
  keyword,
  searchBarRef,
  onSearch,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const userContext = useUser();

  async function handleDeleteHistoryAll(e: React.MouseEvent<HTMLElement>) {
    userContext.mutate({
      ...userContext.data,
      history: [],
    });
  }

  async function handleDeleteHistory(e: React.MouseEvent<HTMLElement>) {
    const history = userContext.data?.history;
    const id = e.currentTarget.id;
    if (history) {
      await userContext.mutate({
        ...userContext.data,
        history: [
          ...history.slice(0, Number(id)),
          ...history.slice(Number(id) + 1, history.length),
        ],
      });
      await userContext.refetch();
    }
  }

  return (
    <>
      <WrapMotionFade key="search">
        <div
          ref={ref}
          className={`overflow-scroll bg-white h-[calc(100vh-${searchBarRef.current?.clientHeight}px)]`}
          id="recentSearchList"
        >
          <div className="flex justify-between mx-4 mb-2 text-xs text-gray-2">
            <div>최근 검색어</div>
            <div
              className="hover:cursor-pointer"
              onClick={handleDeleteHistoryAll}
            >
              모두 삭제
            </div>
          </div>
          <AnimatePresence>
            {Children.toArray(
              [...(userContext.data?.history || [])]
                ?.filter(
                  (each) => keyword === "" || each.indexOf(keyword) === 0
                )
                .map((e, i) => (
                  <WrapMotionAccordion
                    className="flex items-center justify-between mx-4 hover:cursor-pointer"
                    direction="y"
                    offset="3rem"
                    key={e}
                  >
                    <div className="" onClick={onSearch}>
                      {e}
                    </div>
                    <div
                      className="flex items-center hover:cursor-pointer"
                      id={String(i)}
                      onClick={handleDeleteHistory}
                    >
                      <BtnIcon icon="delete" size={SIZE.iconXs} />
                    </div>
                  </WrapMotionAccordion>
                ))
            )}
          </AnimatePresence>
        </div>
      </WrapMotionFade>

      <style jsx>{`
        #recentSearchList {
          height: calc(100vh - ${searchBarRef.current?.clientHeight}px);
        }
      `}</style>
    </>
  );
}
