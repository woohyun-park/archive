import BtnIcon from "components/atoms/BtnIcon";
import ProfileImg from "components/ProfileImg";
import { useCustomRouter } from "hooks";
import { useUser } from "stores/useUser";

export default function FeedHeader({}) {
  const router = useCustomRouter();
  const { curUser, hasNewAlarms } = useUser();

  return (
    <div className="relative flex flex-col mt-4 bg-white">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1
          className="hover:cursor-pointer title-logo"
          onClick={() => router.reload()}
        >
          archive
        </h1>
        <div className="flex items-center justify-center">
          <BtnIcon
            icon="alarm"
            fill={hasNewAlarms ? true : false}
            onClick={() => router.push("/alarm")}
          />
          <ProfileImg
            size="sm"
            photoURL={curUser.photoURL}
            onClick={() => router.push(`/profile/${curUser.id}`)}
          />
        </div>
      </div>
    </div>
  );
}
