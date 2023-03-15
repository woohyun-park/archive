import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { viewAlarms } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import WrapMotion from "./wrappers/WrapMotion";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageAlarmsProps {
  className?: string;
}

export default function PageAlarms({ className }: IPageAlarmsProps) {
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
      setNotifyAlarms(false);
      setAlarms(curUser.alarms);
      viewAlarms(curUser.alarms);
    }
  }, [curUser.alarms]);

  return (
    <WrapPullToRefresh
      isPullable={false}
      onRefresh={async () => {}}
      onFetchMore={async () => {}}
      canFetchMore={false}
      className={mergeTailwindClasses("min-h-[50vh] bg-white", className || "")}
    >
      <AnimatePresence>
        {alarms?.map((alarm, i) => {
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
    </WrapPullToRefresh>
  );
}
