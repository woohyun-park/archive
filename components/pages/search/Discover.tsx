import { InfinitePosts } from "components/common";
import { IInfiniteScroll } from "consts/infiniteScroll";
import { RefObject } from "react";

type Props = {
  infiniteScroll: IInfiniteScroll;
  searchBarRef: RefObject<HTMLDivElement>;
};

export default function Discover({ infiniteScroll, searchBarRef }: Props) {
  const { data, hasNextPage, isFetchingNextPage, refetch, fetchNextPage } =
    infiniteScroll;
  return (
    <>
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
      <style jsx>{`
        #search_posts {
          height: calc(100vh - ${searchBarRef.current?.clientHeight}px);
        }
      `}</style>
    </>
  );
}
