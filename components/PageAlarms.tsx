import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryAlarms } from "../apis/fbDef";
import { viewAlarms } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";
import { useCachedPage } from "../hooks/useCachedPage";
import { IAlarm } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import WrapMotion from "./wrappers/WrapMotion";

export interface IPageAlarmsProps {
  query: IFetchQueryAlarms;
  className?: string;
}

export default function PageAlarms({ query, className }: IPageAlarmsProps) {
  // const { data, canFetchMore, onRefresh, onFetchMore } = useCachedPage(
  //   "alarms",
  //   query
  // );
  const { curUser } = useUser();
  const { setNotifyAlarms } = useStatus();
  const [alarms, setAlarms] = useState(curUser.alarms);

  // const alarms = data as IAlarm[];

  useEffect(() => {
    setNotifyAlarms(false);
    viewAlarms(alarms || []);
  }, []);

  useEffect(() => {
    if (
      curUser.alarms &&
      curUser.alarms.length !== 0 &&
      curUser.alarms.length !== alarms?.length
    ) {
      setAlarms(curUser.alarms);
      viewAlarms(curUser.alarms);
    }
  }, [curUser.alarms]);

  return (
    <PullToRefresh
      onRefresh={async () => {
        // setNotifyAlarms(false);
        // viewAlarms(data as IAlarm[]);
      }}
      onFetchMore={async () => {}}
      // canFetchMore={canFetchMore}
      canFetchMore={false}
      className={mergeTailwindClasses("min-h-[50vh] bg-white", className || "")}
    >
      <AnimatePresence>
        {alarms.map((alarm, i) => {
          return (
            <WrapMotion type="float" key={alarm.id}>
              <>
                {alarm.type === "like" && <AlarmLike alarm={alarm} />}
                {alarm.type === "comment" && <AlarmComment alarm={alarm} />}
                {alarm.type === "follow" && <AlarmFollow alarm={alarm} />}
              </>
            </WrapMotion>
          );
        })}
      </AnimatePresence>
    </PullToRefresh>
  );
}
