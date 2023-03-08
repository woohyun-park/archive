import { AnimatePresence } from "framer-motion";
import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryAlarms } from "../apis/fbDef";
import { mergeTailwindClasses } from "../apis/tailwind";
import { useCachedPage } from "../hooks/useCachedPage";
import { IAlarm } from "../libs/custom";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import Loader from "./Loader";
import WrapMotion from "./wrappers/WrapMotion";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageAlarmsProps {
  query: IFetchQueryAlarms;
  className?: string;
}

export default function PageAlarms({ query, className }: IPageAlarmsProps) {
  const { data, canFetchMore, onRefresh, onFetchMore } = useCachedPage(
    "alarms",
    query
  );

  const alarms = data as IAlarm[];

  return (
    <WrapPullToRefresh
      onRefresh={onRefresh}
      onFetchMore={onFetchMore}
      canFetchMore={canFetchMore}
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
              </>
            </WrapMotion>
          );
        })}
      </AnimatePresence>
    </WrapPullToRefresh>
  );
}
