import { Icon } from "components/atoms";
import ProfileImage from "components/atoms/ProfileImage/ProfileImage";
import { useCustomRouter } from "hooks";
import { useUser } from "providers";

export default function Header({}) {
  const router = useCustomRouter();
  const { data: user } = useUser();

  return (
    <div className="relative flex flex-col mt-4 bg-white">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1 className="hover:cursor-pointer title-logo" onClick={() => router.reload()}>
          archive
        </h1>
        <div className="flex items-center justify-center">
          <Icon
            icon="alarm"
            // fill={hasNewAlarms ? true : false}
            onClick={() => router.push("/alarm")}
          />
          <ProfileImage
            size="sm"
            photoURL={user?.photoURL || ""}
            onClick={() => router.push(`/profile/${user?.id}`)}
          />
        </div>
      </div>
    </div>
  );
}
