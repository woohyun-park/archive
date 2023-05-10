import useAlarm from "hooks/pages/useAlarm";
import InfiniteAlarms from "components/common/InfiniteAlarms";
import { Header } from "components/pages/alarm";

export default function Alarm() {
  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    refetch,
    fetchNextPage,
    mutate,
  } = useAlarm();

  return (
    <>
      <Header alarms={data} mutate={mutate} />
      <InfiniteAlarms
        data={data}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        mutate={mutate}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
}
