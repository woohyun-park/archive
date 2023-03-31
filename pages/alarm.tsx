import BtnIcon from "../components/atoms/BtnIcon";
import WrapMotion from "../components/wrappers/WrapMotion";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { viewAlarm, viewAlarms } from "../apis/fbUpdate";
import useCustomRouter from "../hooks/useCustomRouter";
import { useLoading } from "../hooks/useLoading";
import { IAlarm } from "../apis/interface";
import { useUser } from "../stores/useUser";
import WrapPullToRefresh from "../components/wrappers/WrapPullToRefresh";
import AlarmLike from "../components/AlarmLike";
import AlarmComment from "../components/AlarmComment";
import AlarmFollow from "../components/AlarmFollow";
import Message from "../components/Message";

export default function Alarm() {
  const { curUser } = useUser();
  const [alarms, setAlarms] = useState<IAlarm[]>(curUser.alarms || []);
  const router = useCustomRouter();

  useLoading([]);

  return (
    <WrapMotion type="fade" className="mb-[6.125rem]">
      <div className="flex items-end justify-between m-4">
        <div className="flex">
          <BtnIcon icon="back" onClick={() => router.back()} />
          <div className="title-page-base">알림</div>
        </div>
        {alarms.length !== 0 && (
          <div
            className="text-xs w-fit text-gray-2f hover:cursor-pointer h-fit"
            onClick={() => viewAlarms(alarms)}
          >
            전체 읽음
          </div>
        )}
      </div>
      <WrapPullToRefresh
        onRefresh={async () => setAlarms(curUser.alarms || [])}
        onFetchMore={async () => {}}
        canFetchMore={false}
        className="min-h-[75vh] bg-white"
      >
        <AnimatePresence>
          {alarms.length !== 0 ? (
            <>
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
                      {alarm.type === "follow" && <AlarmFollow alarm={alarm} />}
                    </>
                  </WrapMotion>
                );
              })}
            </>
          ) : (
            <Message icon="none" detailedMessage="알림이 없습니다" />
          )}
        </AnimatePresence>
      </WrapPullToRefresh>
    </WrapMotion>
  );
}
