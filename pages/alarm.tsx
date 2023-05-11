import { Header } from "components/pages/alarm";
import InfiniteAlarms from "components/common/InfiniteAlarms";
import { ModalSpinner } from "components/templates";
import useAlarm from "hooks/pages/useAlarm";

export default function Alarm() {
  const infiniteScroll = useAlarm();

  if (infiniteScroll.isLoading) return <ModalSpinner />;

  return (
    <>
      <Header alarms={infiniteScroll.data} mutate={infiniteScroll.mutate} />
      <InfiniteAlarms infiniteScroll={infiniteScroll} />
    </>
  );
}
