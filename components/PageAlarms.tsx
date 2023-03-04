import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { IFetchQueryAlarms } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IAlarm, IPost } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
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
  const router = useRouter();

  const cache = useCachedPage("alarms");

  const path = router.asPath;

  const alarms = cache.data as IAlarm[];
  function onIntersect() {
    cache.fetchAlarms && cache.fetchAlarms("load", query, path);
  }
  function onChange() {}
  async function onRefresh() {
    cache.fetchAlarms && (await cache.fetchAlarms("refresh", query, path));
  }
  const changeListener = alarms;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        cache.fetchAlarms && (await cache.fetchAlarms("init", query, path));
      }
    }
    init();
  }, []);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });

  return (
    <>
      <WrapRefreshAndLoad
        onRefresh={onRefresh}
        loading={loading}
        className={className}
      >
        <AnimatePresence>
          {alarms.map((alarm, i) => {
            return (
              <WrapMotion type="float" key={alarm.id} className="min-h-[50vh]">
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
    </>
  );
}
