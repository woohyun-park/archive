import { IAlarm } from "../libs/custom";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";

interface IPageAlarmProps {
  alarms: IAlarm[];
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageAlarm({
  alarms,
  setLastIntersecting,
}: IPageAlarmProps) {
  return (
    <>
      {alarms.map((alarm, i) => {
        return (
          <>
            {alarm.type === "like" && <AlarmLike alarm={alarm} />}
            {alarm.type === "comment" && <AlarmComment alarm={alarm} />}
            {alarm.type === "follow" && <AlarmFollow alarm={alarm} />}
            {i === alarms.length - 1 && <div ref={setLastIntersecting}></div>}
          </>
        );
      })}
    </>
  );
}
