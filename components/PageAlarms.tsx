import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { viewAlarms } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";
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
  const [alarms, setAlarms] = useState(curUser.alarms);

  // 해당 페이지에 들어오면 먼저 모든 알람을 view한것으로 처리한다.
  useEffect(() => {
    viewAlarms(alarms || []);
  }, []);

  return (
    <WrapPullToRefresh
      onRefresh={async () => {
        setAlarms(curUser.alarms);
        viewAlarms(curUser.alarms || []);
      }}
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
