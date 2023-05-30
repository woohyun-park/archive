import { useInfiniteScroll, useScrollBack } from "hooks";

import { Header } from "components/pages/alarm";
import InfiniteAlarms from "components/common/InfiniteAlarms";
import { ModalSpinner } from "components/templates";
import { updateAlarms } from "apis/firebase";
import useFirebaseQuery from "hooks/useFirebaseQuery";
import { useMutation } from "@tanstack/react-query";

export default function Alarm() {
  const infiniteScroll = useInfiniteScroll({
    queryKey: ["alarm"],
    ...useFirebaseQuery("alarm/alarms"),
  });
  const { mutate } = useMutation({
    mutationFn: updateAlarms,
  });

  useScrollBack();

  if (infiniteScroll.isLoading) return <ModalSpinner />;

  return (
    <>
      <Header alarms={infiniteScroll.data} mutate={mutate} />
      <InfiniteAlarms infiniteScroll={infiniteScroll} />
    </>
  );
}
