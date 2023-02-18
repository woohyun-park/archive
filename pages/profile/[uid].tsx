import { signOut } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "../../apis/firebase";
import { IDict, IPost, IScrap, ITag, IUser, SIZE } from "../../libs/custom";
import { useEffect, useState } from "react";
import Motion from "../../components/wrappers/WrapMotion";
import Btn from "../../components/atoms/Btn";
import { useUser } from "../../stores/useUser";
import BtnIcon from "../../components/atoms/BtnIcon";
import { useRouter } from "next/router";
import ProfileImg from "../../components/ProfileImg";
import { readData, readDatasByQuery, readPost } from "../../apis/fbRead";
import { useStatus } from "../../stores/useStatus";
import { updateFollow } from "../../apis/fbUpdate";

export default function Profile() {
  const [initUser, setInitUser] = useState<IUser | undefined>(undefined);
  const [initPosts, setInitPosts] = useState<IPost[]>([]);
  const [initScraps, setInitScraps] = useState<IDict<IPost[]>>({});
  const [initTags, setInitTags] = useState<IDict<IPost[]>>({});

  useEffect(() => {
    async function init() {
      const uid = router.query.uid as string;
      const user = await readData<IUser>("users", uid);
      if (!user) return;
      const posts = await readDatasByQuery<IPost>(
        query(collection(db, "posts"), where("uid", "==", uid))
      );
      const resScraps = await readDatasByQuery<IScrap>(
        query(collection(db, "scraps"), where("uid", "==", uid))
      );
      const scraps: IDict<IPost[]> = {};
      for await (const scrap of resScraps) {
        const pid = scrap.pid;
        const tempPost = await readPost(pid);
        if (!tempPost) continue;
        if (scraps[scrap.cont]) {
          scraps[scrap.cont].push(tempPost);
        } else {
          scraps[scrap.cont] = [tempPost];
        }
      }

      const resTags = await readDatasByQuery<ITag>(
        query(collection(db, "tags"), where("uid", "==", uid))
      );

      const tags: IDict<IPost[]> = {};
      for await (const tag of resTags) {
        const pid = tag.pid || "";
        const tempPost = await readPost(pid);
        if (!tempPost) continue;
        if (tags[tag.name]) {
          tags[tag.name].push(tempPost);
        } else {
          tags[tag.name] = [tempPost];
        }
      }
      setInitUser(user);
      setInitPosts(posts);
      setInitScraps(scraps);
      setInitTags(tags);
    }
    init();
  }, []);

  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const router = useRouter();
  const [user, setUser] = useState({
    initIsFollowing: curUser.followings.find((elem) => elem === initUser?.id)
      ? true
      : false,
    isFollowing: curUser.followings.find((elem) => elem === initUser?.id)
      ? true
      : false,
  });
  const [posts, setPosts] = useState(initPosts);
  const [tags, setTags] = useState(initTags);
  const [scraps, setScraps] = useState(initScraps);

  useEffect(() => {
    setModalLoader(false);
  }, []);

  async function handleToggleFollow() {
    if (!initUser) return;
    await updateFollow(curUser, initUser, user.isFollowing);
    let len = initUser.followers.length;
    if (user.initIsFollowing === user.isFollowing) {
    } else if (user.initIsFollowing) {
      len--;
    } else {
      len++;
    }
    setUser({ ...user, isFollowing: !user.isFollowing });
  }

  return (
    <>
      {initUser !== undefined ? (
        <>
          <Motion type="fade">
            <div className="flex justify-between">
              {initUser.id === curUser.id ? (
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
                  {initUser.displayName}
                </h1>
                <div className="flex justify-between w-2/3">
                  <div>
                    <div className="text-gray-2">아카이브</div>
                    <div className="profileNum">{initPosts.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-2">팔로워</div>
                    <div className="profileNum">
                      {(() => {
                        if (initUser.id === curUser.id) {
                          return curUser.followers.length;
                        }
                        const len = initUser.followers.length;
                        if (user.initIsFollowing === user.isFollowing) {
                          return len;
                        } else if (user.initIsFollowing) {
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
                      {initUser.id === curUser.id
                        ? curUser.followings.length
                        : initUser.followings.length}
                    </div>
                  </div>
                </div>
              </div>
              <ProfileImg size="lg" photoURL={initUser.photoURL} />
            </div>

            <div className="h-full py-4 break-all min-h-[96px]">
              {initUser.txt}
            </div>

            {initUser.id === curUser.id ? (
              <Btn
                label="로그아웃"
                onClick={() => signOut(auth)}
                style={{ width: "100%" }}
              />
            ) : (
              <>
                {(() => {
                  const result = [];
                  if (curUser.id !== initUser.id) {
                    if (
                      curUser.followings.find((elem) => elem === initUser.id)
                    ) {
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
            {/* <Tab
              data={{ grid: posts, tag: tags, scrap: scraps }}
              tab={[
                ["grid", "post"],
                ["tag", "cont"],
                ["scrap", "cont"],
              ]}
              route="profile"
            /> */}
          </Motion>
          <div className="mb-24"></div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
