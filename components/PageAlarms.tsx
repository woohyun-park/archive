import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { viewAlarm, viewAlarms } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";
import { useLoading } from "../hooks/useLoading";
import { IAlarm } from "../libs/custom";
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
  const { curUser } = useUser();
  const [alarms, setAlarms] = useState<IAlarm[]>(curUser.alarms || []);

  useLoading([]);

  return (
    <>
      <div className="flex justify-end">
        <div
          className="mx-4 mb-2 text-xs w-fit text-gray-2f hover:cursor-pointer"
          onClick={() => viewAlarms(alarms)}
        >
          전체 읽음
        </div>
      </div>
      <WrapPullToRefresh
        onRefresh={async () => setAlarms(curUser.alarms || [])}
        onFetchMore={async () => {}}
        canFetchMore={false}
        className={mergeTailwindClasses(
          "min-h-[50vh] bg-white",
          className || ""
        )}
      >
        <AnimatePresence>
          {alarms?.map((alarm, i) => {
            return (
              <WrapMotion
                type="float"
                key={alarm.id}
                onClick={() => viewAlarm(alarm)}
              >
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
    </>
  );
}
