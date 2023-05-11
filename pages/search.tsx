import { Discover, RecentSearchList, SearchBar } from "components/pages/search";
import { ModalSpinner } from "components/templates";
import { useUser } from "contexts";
import { useCustomRouter, useOutsideClick } from "hooks";
import { useSearch } from "hooks/pages";
import { useRef, useState } from "react";

export default function Search() {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState("");
  const searchBarRef = useRef<HTMLDivElement>(null);
  const contRef = useRef<HTMLDivElement>(null);

  const router = useCustomRouter();
  const { data: user, mutate: mutateUser, refetch: refetchUser } = useUser();
  const infiniteScroll = useSearch();

  useOutsideClick(contRef, () => setIsSearching(false));

  const getNewSearchHistory = (arr: string[] | undefined, keyword: string) => {
    if (arr) {
      const index = arr.indexOf(keyword);
      return index === -1
        ? [keyword, ...arr]
        : [
            keyword,
            ...arr.slice(0, index),
            ...arr.slice(index + 1, arr.length),
          ];
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

  if (infiniteScroll.isLoading) return <ModalSpinner />;

  return (
    <>
      <div className="relative overflow-hidden" ref={contRef}>
        <SearchBar
          ref={searchBarRef}
          keyword={keyword}
          setKeyword={setKeyword}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          onSearch={handleSearch}
          refetch={refetchUser}
        />
        {!isSearching ? (
          <Discover
            infiniteScroll={infiniteScroll}
            searchBarRef={searchBarRef}
          />
        ) : (
          <RecentSearchList
            keyword={keyword}
            searchBarRef={searchBarRef}
            onSearch={handleSearch}
          />
        )}
      </div>
    </>
  );
}
