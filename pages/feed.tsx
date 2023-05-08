import React from "react";
import { useScrollBack } from "hooks";
import { ModalSpinner, PageError } from "components/templates";
import { HeaderFeed, PostsColOne } from "components/organisms";
import { useFeed } from "hooks/pages";

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
  useScrollBack();

  if (isLoading) return <ModalSpinner />;
  // if (error) return <PageError />;

  return (
    <>
      <HeaderFeed />
      <PostsColOne
        data={data}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
