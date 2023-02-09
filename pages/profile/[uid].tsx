import { signOut } from "firebase/auth";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import {
  auth,
  db,
  getData,
  getDatasByQuery,
  getPath,
  updateFollow,
} from "../../apis/firebase";
import Tab from "../../components/Tab";
import { IDict, IPost, IScrap, ITag, IUser, SIZE } from "../../libs/custom";
import { useState } from "react";
import Image from "next/image";
import Motion from "../../motions/Motion";
import Btn from "../../components/atoms/Btn";
import { useUser } from "../../stores/useUser";
import IconBtn from "../../components/atoms/IconBtn";
import { useRouter } from "next/router";
import ProfileImg from "../../components/atoms/ProfileImg";

interface IProfileProps {
  initUser: IUser;
  initPosts: IPost[];
  initScraps: IDict<IPost[]>;
  initTags: IDict<IPost[]>;
}

export default function Profile({
  initUser,
  initPosts,
  initScraps,
  initTags,
}: IProfileProps) {
  const { curUser } = useUser();
  const [user, setUser] = useState({
    initIsFollowing: curUser.followings.find((elem) => elem === initUser.id)
      ? true
      : false,
    isFollowing: curUser.followings.find((elem) => elem === initUser.id)
      ? true
      : false,
  });
  const [posts, setPosts] = useState(initPosts);
  const [tags, setTags] = useState(initTags);
  const [scraps, setScraps] = useState(initScraps);

  async function handleToggleFollow() {
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
  const router = useRouter();

  return (
    <>
      <Motion type="fade">
        <div className="flex justify-between">
          {initUser.id === curUser.id ? (
            <>
              <IconBtn icon="back" onClick={() => router.back()} />
              <IconBtn icon="setting" onClick={() => router.push("/setting")} />
            </>
          ) : (
            <IconBtn icon="back" onClick={() => router.back()} />
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

        <div className="h-full py-4 break-all min-h-[96px]">{initUser.txt}</div>

        {initUser.id === curUser.id ? (
          <Btn onClick={() => signOut(auth)} style="width: 100%;">
            로그아웃
          </Btn>
        ) : (
          <>
            {(() => {
              const result = [];
              if (curUser.id !== initUser.id) {
                if (curUser.followings.find((elem) => elem === initUser.id)) {
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
        <Tab
          data={{ grid: posts, tag: tags, scrap: scraps }}
          tab={[
            ["grid", "post"],
            ["tag", "cont"],
            ["scrap", "cont"],
          ]}
          route="profile"
        />
      </Motion>
      <div className="mb-24"></div>
    </>
  );
}

interface IServerSidePaths {
  params: IServerSideProps;
}

interface IServerSideProps {
  uid: string;
}

export async function getServerSidePaths() {
  const paths = getPath("users", "uid");
  return { paths, fallback: false };
}

export async function getServerSideProps({ params }: IServerSidePaths) {
  const uid = params.uid;
  const initUser = await getData<IUser>("users", uid);
  const initPosts = await getDatasByQuery<IPost>(
    query(collection(db, "posts"), where("uid", "==", uid))
  );
  const resScraps = await getDatasByQuery<IScrap>(
    query(collection(db, "scraps"), where("uid", "==", uid))
  );
  const initScraps: IDict<IPost[]> = {};
  for await (const scrap of resScraps) {
    const res = await getDoc(doc(db, "posts", scrap.pid));
    const tempPost = {
      ...(res.data() as IPost),
      createdAt: res.data()?.createdAt.toDate(),
    };
    if (initScraps[scrap.cont]) {
      initScraps[scrap.cont].push(tempPost);
    } else {
      initScraps[scrap.cont] = [tempPost];
    }
  }

  const resTags = await getDatasByQuery<ITag>(
    query(collection(db, "tags"), where("uid", "==", uid))
  );

  const initTags: IDict<IPost[]> = {};
  for await (const tag of resTags) {
    const res = await getDoc(doc(db, "posts", tag.pid as string));
    const tempPost = {
      ...(res.data() as IPost),
      createdAt: res.data()?.createdAt.toDate(),
    };
    if (initTags[tag.name]) {
      initTags[tag.name].push(tempPost);
    } else {
      initTags[tag.name] = [tempPost];
    }
  }

  return { props: { initUser, initPosts, initScraps, initTags } };
}
