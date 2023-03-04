import { IDict, IPost, IUser } from "../../libs/custom";
import { useEffect, useState } from "react";
import Motion from "../../components/wrappers/WrapMotion";
import { useUser } from "../../stores/useUser";
import BtnIcon from "../../components/atoms/BtnIcon";
import { useRouter } from "next/router";
import ProfileImg from "../../components/ProfileImg";
import { readData } from "../../apis/fbRead";
import { useStatus } from "../../stores/useStatus";
import { updateFollow } from "../../apis/fbUpdate";
import { useCachedPage } from "../../hooks/useCachedPage";
import PageTab from "../../components/PageTab";
import { useLoading } from "../../hooks/useLoading";
import { signOut } from "firebase/auth";
import { auth } from "../../apis/firebase";
import Btn from "../../components/atoms/Btn";

export default function Profile() {
  const { curUser } = useUser();
  const posts = useCachedPage("posts", "tabPosts");
  useLoading(["tags", "scraps", "posts"]);

  const router = useRouter();
  const [user, setUser] = useState<IUser>();
  const [status, setStatus] = useState({
    initIsFollowing: curUser.followings.find((elem) => elem === user?.id)
      ? true
      : false,
    isFollowing: curUser.followings.find((elem) => elem === user?.id)
      ? true
      : false,
  });

  const uid = user?.id;

  useEffect(() => {
    async function init() {
      const uid = router.query.uid as string;
      const user = await readData<IUser>("users", uid);
      setUser(user);
    }
    init();
  }, []);

  async function handleToggleFollow() {
    if (!user) return;
    await updateFollow(curUser, user, status.isFollowing);
    let len = user.followers.length;
    if (status.initIsFollowing === status.isFollowing) {
    } else if (status.initIsFollowing) {
      len--;
    } else {
      len++;
    }
    setStatus({ ...status, isFollowing: !status.isFollowing });
  }

  return (
    <>
      {user !== undefined ? (
        <PageTab
          header={
            <Motion type="fade" className="mx-4">
              <div className="flex justify-between">
                {user.id === curUser.id ? (
                  <>
                    <BtnIcon icon="back" onClick={() => router.back()} />
                    <BtnIcon
                      icon="setting"
                      onClick={() => router.push("/setting")}
                    />
                  </>
                ) : (
                  <BtnIcon icon="back" onClick={() => router.back()} />
                )}
              </div>
              <div className="flex items-start justify-between mt-8">
                <div className="w-2/3">
                  <h1 className="text-xl font-bold break-all">
                    {user.displayName}
                  </h1>
                  <div className="flex justify-between w-2/3">
                    <div>
                      <div className="text-gray-2">아카이브</div>
                      <div className="profileNum">{posts.data.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-2">팔로워</div>
                      <div className="profileNum">
                        {(() => {
                          if (user.id === curUser.id) {
                            return curUser.followers.length;
                          }
                          const len = user.followers.length;
                          if (status.initIsFollowing === status.isFollowing) {
                            return len;
                          } else if (status.initIsFollowing) {
                            return len - 1;
                          } else {
                            return len + 1;
                          }
                        })()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-2">팔로잉</div>
                      <div className="profileNum">
                        {user.id === curUser.id
                          ? curUser.followings.length
                          : user.followings.length}
                      </div>
                    </div>
                  </div>
                </div>
                <ProfileImg size="lg" photoURL={user.photoURL} />
              </div>

              <div className="h-full py-4 break-all">{user.txt}</div>

              {user.id !== curUser.id && (
                <>
                  {(() => {
                    const result = [];
                    if (curUser.id !== user.id) {
                      if (curUser.followings.find((elem) => elem === user.id)) {
                        result.push(
                          <button
                            onClick={handleToggleFollow}
                            className="w-full my-4 button-gray"
                          >
                            팔로잉
                          </button>
                        );
                      } else {
                        result.push(
                          <button
                            onClick={handleToggleFollow}
                            className="w-full my-4 button-black"
                          >
                            팔로우
                          </button>
                        );
                      }
                    }
                    return result;
                  })()}
                </>
              )}
            </Motion>
          }
          tabs={
            uid === curUser.id
              ? [
                  {
                    type: "posts",
                    label: "posts",
                    query: { type: "uid", value: { uid } },
                    as: "posts",
                    numCols: 2,
                  },
                  {
                    type: "tags",
                    label: "tags",
                    query: { type: "uid", value: { uid } },
                    as: "tags",
                  },
                  {
                    type: "scraps",
                    label: "scraps",
                    query: { type: "uid", value: { uid } },
                  },
                ]
              : [
                  {
                    type: "posts",
                    label: "posts",
                    query: { type: "uid", value: { uid } },
                    as: "posts",
                    numCols: 2,
                  },
                  {
                    type: "tags",
                    label: "tags",
                    query: { type: "uid", value: { uid } },
                    as: "tags",
                  },
                ]
          }
          className="mt-4"
        />
      ) : (
        <></>
      )}
    </>
  );
}
