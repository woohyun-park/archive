import { Icon, ProfileImg } from "components/atoms";

import { IUser } from "types/common";
import { WrapMotionFade } from "components/wrappers/motion";
import { useCustomRouter } from "hooks";

type Props = {
  curUser: IUser;
  user: IUser;
};

export default function Header({ curUser, user }: Props) {
  const router = useCustomRouter();

  return (
    <WrapMotionFade className="mx-4 mt-4">
      <div className="flex justify-between">
        {user.id === curUser.id ? (
          <>
            <Icon icon="back" onClick={() => router.back()} />
            <Icon icon="setting" onClick={() => router.push("/setting")} />
          </>
        ) : (
          <Icon icon="back" onClick={() => router.back()} />
        )}
      </div>
      <div className="flex items-start justify-between mt-8">
        <div className="w-2/3">
          <h1 className="text-xl font-bold break-all">{user.displayName}</h1>
          <div className="flex justify-between w-2/3">
            <div>
              <div className="text-gray-2">아카이브</div>
              {/* <div className="profileNum">{posts.length}</div> */}
            </div>
            <div>
              <div className="text-gray-2">팔로워</div>
              <div className="profileNum">{}</div>
            </div>
            <div>
              <div className="text-gray-2">팔로잉</div>
              <div className="profileNum">
                {user.id === curUser.id ? curUser.followings.length : user.followings.length}
              </div>
            </div>
          </div>
        </div>
        <ProfileImg size="lg" photoURL={user.photoURL} />
      </div>

      <div className="h-full py-4 break-all">{user.txt}</div>

      {user.id !== curUser?.id && (
        <>
          {(() => {
            const result = [];
            if (curUser?.id !== user.id) {
              if (curUser?.followings.find((elem) => elem === user.id)) {
                result.push(
                  <button onClick={() => {}} className="w-full my-4 button-gray">
                    팔로잉
                  </button>
                );
              } else {
                result.push(
                  <button onClick={() => {}} className="w-full my-4 button-black">
                    팔로우
                  </button>
                );
              }
            }
            return result;
          })()}
        </>
      )}
    </WrapMotionFade>
  );
}
