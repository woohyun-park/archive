import { AnimatePresence } from "framer-motion";
import React from "react";
import { IFetchQueryAlarms } from "../apis/fbDef";
import { mergeTailwindClasses } from "../apis/tailwind";
import { useCachedPage } from "../hooks/useCachedPage";
import { IAlarm } from "../libs/custom";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import WrapMotion from "./wrappers/WrapMotion";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPageAlarmsProps {
  query: IFetchQueryAlarms;
  className?: string;
}

export default function PageAlarms({ query, className }: IPageAlarmsProps) {
  const { data, isLast, onRefresh, setLastIntersecting, loading } =
    useCachedPage("alarms", query);

  const alarms = data as IAlarm[];

  return (
    <WrapRefreshAndLoad
      onRefresh={onRefresh}
      loading={loading}
      className={mergeTailwindClasses("min-h-[50vh]", className || "")}
    >
      <AnimatePresence>
        {alarms.map((alarm, i) => {
          return (
            <WrapMotion type="float" key={alarm.id}>
              <>
                {alarm.type === "like" && <AlarmLike alarm={alarm} />}
                {alarm.type === "comment" && <AlarmComment alarm={alarm} />}
                {alarm.type === "follow" && <AlarmFollow alarm={alarm} />}
                {!isLast && i === alarms.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            </WrapMotion>
          );
        })}
      </AnimatePresence>
    </WrapRefreshAndLoad>
  );
}
