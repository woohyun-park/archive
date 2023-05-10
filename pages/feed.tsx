import React from "react";
import { ModalSpinner } from "components/templates";
import { InfinitePosts, Message } from "components/common";
import { useFeed } from "hooks/pages";
import { Header } from "components/pages/feed";

export default function Feed() {
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
  } = useFeed();
  // useScrollBack();

  if (isLoading) return <ModalSpinner />;
  // if (error) return <PageError />;

  return (
    <>
      <Header />
      <InfinitePosts
        numCols={1}
        data={data}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
        lastPage={
          <Message
            icon="wink"
            message="모두 확인했습니다"
            detailedMessage="팔로잉중인 아카이버들의 게시물을 모두 확인했습니다"
          />
        }
      />
    </>
  );
}
