import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { viewAlarms } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";
import { useLoading } from "../hooks/useLoading";
import { wrapPromise } from "../stores/libStores";
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
  const { curUser, setHasNewAlarms } = useUser();
  const [alarms, setAlarms] = useState(curUser.alarms);

  useLoading([]);

  // 해당 페이지에 들어오면 먼저 모든 알람을 view한것으로 처리한다.
  useEffect(() => {
    async function init() {
      await wrapPromise(() => {}, 3000);
      // viewAlarms(curUser.alarms || []);
    }
    init();
  }, []);

  return (
    <WrapPullToRefresh
      onRefresh={async () => {
        console.log("onRefresh", alarms, curUser.alarms);
        const prevAlarms = [...(alarms || [])];
        const newAlarms = curUser.alarms?.map((alarm) => {
          if (
            prevAlarms?.findIndex((prevAlarm) => prevAlarm.id === alarm.id) ===
            -1
          ) {
            const newAlarm = { ...alarm, isViewed: false };
            return newAlarm;
          }
          return alarm;
        });
        await wrapPromise(() => setAlarms(newAlarms), 0);
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
