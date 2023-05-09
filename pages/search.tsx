import { SIZE } from "../apis/def";
import React, { Children, useRef, useState } from "react";
import WrapMotion from "../components/wrappers/motion/WrapMotionFloat";
import InputIcon from "../components/atoms/InputIcon";
import { updateUser } from "../apis/firebase/fbUpdate";
import { AnimatePresence } from "framer-motion";
import BtnIcon from "../components/atoms/BtnIcon";
import { useCustomRouter } from "hooks";
import SearchBarSearch from "components/pages/search/SearchBarSearch";
import { InfinitePosts } from "components/common";
import { useDiscover } from "hooks/pages";
import { ModalSpinner } from "components/templates";
import WrapMotionAccordion from "components/wrappers/motion/WrapMotionAccordion";
import WrapMotionFade from "components/wrappers/motion/WrapMotionFade";
import { useUser } from "contexts/UserProvider";

export default function Search() {
  const router = useCustomRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [keyword, setKeyword] = useState("");

  const userContext = useUser();

  function handleDeleteHistoryAll(e: React.MouseEvent<HTMLElement>) {
    userContext.mutate({
      ...userContext.data,
      history: [],
    });
  }

  function handleDeleteHistory(e: React.MouseEvent<HTMLElement>) {
    const history = userContext.data.history;
    const id = e.currentTarget.id;
    if (history) {
      userContext.mutate({
        ...userContext.data,
        history: [
          ...history.slice(0, Number(id)),
          ...history.slice(Number(id) + 1, history.length),
        ],
      });
    }
  }

  function handleSearch() {
    const newUser: { id: string; history: string[] } = {
      id: userContext.data.id,
      history: [],
    };
    if (userContext.data.history) {
      const index = userContext.data.history.indexOf(keyword);
      newUser.history =
        index === -1
          ? [keyword, ...userContext.data.history]
          : [
              keyword,
              ...userContext.data.history.slice(0, index),
              ...userContext.data.history.slice(
                index + 1,
                userContext.data.history.length
              ),
            ];
    } else {
      newUser.history = [keyword];
    }
    userContext.mutate(newUser);
    router.push(`/search/${keyword}`);
  }

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useDiscover();

  if (isLoading) return <ModalSpinner />;

  return (
    <>
      <div className="relative overflow-hidden">
        <SearchBarSearch
          ref={searchBarRef}
          keyword={keyword}
          setKeyword={setKeyword}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          onSearch={handleSearch}
          refetch={userContext.refetch}
        />
        {!isSearching ? (
          <div className="overflow-scroll" id="search_posts">
            <InfinitePosts
              numCols={3}
              data={data}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              refetch={refetch}
              fetchNextPage={fetchNextPage}
              className="mx-4 mb-32"
            />
          </div>
        ) : (
          <WrapMotionFade key="search">
            <div
              ref={recentRef}
              className={`overflow-scroll bg-white h-[calc(100vh-${searchBarRef.current?.clientHeight}px)]`}
              id="search_searchBar"
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
                  [...(userContext.data.history || [])]
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
                        <div className="" onClick={handleSearch}>
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
        )}
      </div>
      <style jsx>{`
        #search_posts {
          height: calc(100vh - ${searchBarRef.current?.clientHeight}px);
        }
        #search_searchBar {
          height: calc(100vh - ${searchBarRef.current?.clientHeight}px);
        }
      `}</style>
    </>
  );
}
