import { useCustomRouter, useInfiniteScroll, useOutsideClick, useScrollBack } from "hooks";
import { useRef, useState } from "react";

import { InfinitePosts } from "components/common";
import InputBar from "components/molecules/InputBar/InputBar";
import { PageSpinner } from "components/templates";
import { RecentSearchList } from "components/pages/search";
import useFirebaseQuery from "hooks/useFirebaseQuery";
import { useUser } from "providers";

export default function Search() {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const contRef = useRef<HTMLDivElement>(null);
  const router = useCustomRouter();
  const { data: user, mutate: mutateUser, refetch: refetchUser } = useUser();
  const infiniteScroll = useInfiniteScroll({
    queryKey: ["search/posts"],
    ...useFirebaseQuery("search/posts"),
  });

  useOutsideClick(contRef, () => setIsSearching(false));
  useScrollBack();

  const getNewSearchHistory = (arr: string[] | undefined, keyword: string) => {
    if (arr) {
      const index = arr.indexOf(keyword);
      return index === -1
        ? [keyword, ...arr]
        : [keyword, ...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];
    }
    return [keyword];
  };

  const handleSearch = () => {
    mutateUser({
      id: user?.id,
      history: getNewSearchHistory(user?.history, keyword),
    });
    router.push(`/search/${keyword}`);
  };

  if (infiniteScroll.isLoading) return <PageSpinner />;

  return (
    <>
      <div className="relative overflow-hidden" ref={contRef}>
        <InputBar
          className="p-4"
          icon="search"
          ref={searchBarRef}
          keyword={keyword}
          setKeyword={setKeyword}
          isActive={isSearching}
          setIsActive={setIsSearching}
          onSubmit={handleSearch}
          refetch={refetchUser}
        />
        {!isSearching ? (
          <InfinitePosts numCols={3} infiniteScroll={infiniteScroll} className="mx-4" />
        ) : (
          <RecentSearchList keyword={keyword} searchBarRef={searchBarRef} onSearch={handleSearch} />
        )}
      </div>
    </>
  );
}
