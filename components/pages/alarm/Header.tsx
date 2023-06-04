import { IAlarm } from "apis/def";
import { IField } from "consts/firebase";
import { Icon } from "components/atoms";
import { useCustomRouter } from "hooks";

type Props = {
  alarms: IAlarm[];
  mutate: (fields: IField[]) => void;
};

export default function Header({ alarms, mutate }: Props) {
  const router = useCustomRouter();

  function handleViewAll() {
    mutate(
      alarms.map((alarm) => {
        return {
          id: alarm.id,
          isViewed: true,
        };
      })
    );
  }

  return (
    <div className="flex items-end justify-between m-4">
      <div className="flex">
        <Icon icon="back" onClick={() => router.back()} />
        <div className="title-page-base">알림</div>
      </div>
      {alarms.length !== 0 && (
        <div
          className="text-xs w-fit text-gray-2f hover:cursor-pointer h-fit"
          onClick={handleViewAll}
        >
          전체 읽음
        </div>
      )}
    </div>
  );
}
