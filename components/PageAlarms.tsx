import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { viewAlarm, viewAlarms } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";
import useCustomRouter from "../hooks/useCustomRouter";
import { useLoading } from "../hooks/useLoading";
import { IAlarm } from "../libs/custom";
import { useUser } from "../stores/useUser";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import Message from "./Message";
import WrapMotion from "./wrappers/WrapMotion";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageAlarmsProps {
  className?: string;
}

export default function PageAlarms({ className }: IPageAlarmsProps) {
  const { curUser } = useUser();
  const [alarms, setAlarms] = useState<IAlarm[]>(curUser.alarms || []);
  const router = useCustomRouter();

  useLoading([]);

  return (
    <>
      <>
        <WrapPullToRefresh
          onRefresh={async () => setAlarms(curUser.alarms || [])}
          onFetchMore={async () => {}}
          canFetchMore={false}
          className={mergeTailwindClasses(
            "min-h-[75vh] bg-white",
            className || ""
          )}
        >
          <AnimatePresence>
            {alarms.length !== 0 ? (
              <>
                <div className="flex justify-end">
                  <div
                    className="mx-4 mb-2 text-xs w-fit text-gray-2f hover:cursor-pointer"
                    onClick={() => viewAlarms(alarms)}
                  >
                    전체 읽음
                  </div>
                </div>
                {alarms?.map((alarm, i) => {
                  return (
                    <WrapMotion
                      type="float"
                      key={alarm.id}
                      onClick={() => viewAlarm(alarm)}
                    >
                      <>
                        {alarm.type === "like" && <AlarmLike alarm={alarm} />}
                        {alarm.type === "comment" && (
                          <AlarmComment alarm={alarm} />
                        )}
                        {alarm.type === "follow" && (
                          <AlarmFollow alarm={alarm} />
                        )}
                      </>
                    </WrapMotion>
                  );
                })}
              </>
            ) : (
              <Message
                includeIcon={false}
                includeBtn={false}
                detailedMessage="알림이 없습니다"
              />
            )}
          </AnimatePresence>
        </WrapPullToRefresh>
      </>
    </>
  );
}
