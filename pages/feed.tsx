import React from "react";
import { useScrollBack } from "../hooks/useScrollBack";
import useFeed from "../services/useFeed";
import PageSpinner from "../components/templates/PageSpinner";
import PageError from "../components/templates/PageError";
import PageFeed from "../components/templates/PageFeed";

export default function Feed() {
  const { isLoading, hasNextPage, error, data, fetchNextPage, refetch } =
    useFeed();
  useScrollBack();

  if (isLoading) return <PageSpinner />;
  if (error) return <PageError />;

  return (
    <PageFeed
      data={data}
      hasNextPage={hasNextPage}
      refetch={refetch}
      fetchNextPage={fetchNextPage}
    />
  );
}
