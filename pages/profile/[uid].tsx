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
import List from "../../components/List";
import { COLOR, IDict, IPost, IScrap, ITag, IUser, SIZE } from "../../custom";
import { HiOutlineCog } from "react-icons/hi";
import { useStore } from "../../apis/zustand";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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
  const { gCurUser } = useStore();
  console.log(initUser, initPosts, initScraps, initTags);
  console.log(gCurUser);
  const [user, setUser] = useState({
    initIsFollowing: gCurUser.followings.find((elem) => elem === initUser.id)
      ? true
      : false,
    isFollowing: gCurUser.followings.find((elem) => elem === initUser.id)
      ? true
      : false,
  });

  async function handleToggleFollow() {
    await updateFollow(gCurUser, initUser, user.isFollowing);
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
      <>
        {initUser.id === gCurUser.id && (
          <div className="settingCont">
            <Link href="/setting" legacyBehavior>
              <div className="setting">
                <HiOutlineCog size={SIZE.icon} />
              </div>
            </Link>
          </div>
        )}
        <div className="profileTopCont">
          <div className="profileLeftCont">
            <h1>{initUser.displayName}</h1>
            <div className="profileInfoCont">
              <div>
                <div className="profileType">아카이브</div>
                <div className="profileNum">{initPosts.length}</div>
              </div>
              <div>
                <div className="profileType">팔로워</div>
                <div className="profileNum">
                  {(() => {
                    if (initUser.id === gCurUser.id) {
                      return gCurUser.followers.length;
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
                <div className="profileType">팔로잉</div>
                <div className="profileNum">
                  {initUser.id === gCurUser.id
                    ? gCurUser.followings.length
                    : initUser.followings.length}
                </div>
              </div>
            </div>
          </div>
          <div className="profileImage">
            <Image src={initUser.photoURL} alt="" fill />
          </div>
        </div>
        {(() => {
          const result = [];
          if (gCurUser.id !== initUser.id) {
            if (gCurUser.followings.find((elem) => elem === initUser.id)) {
              result.push(
                <button onClick={handleToggleFollow} className="g-button2">
                  팔로잉
                </button>
              );
            } else {
              result.push(
                <button onClick={handleToggleFollow} className="g-button1">
                  팔로우
                </button>
              );
            }
          }
          return result;
        })()}
        <div className="profileTxtCont">{initUser.txt}</div>
        {initUser.id === gCurUser.id ? (
          <>
            <button onClick={() => signOut(auth)} className="g-button1">
              로그아웃
            </button>
          </>
        ) : (
          <></>
        )}
        <List
          data={{ grid: initPosts, tag: initTags, scrap: initScraps }}
          style="profile"
        />
      </>

      <style jsx>
        {`
          h1 {
            margin-top: 0;
            word-break: break-all;
          }
          .settingCont{
            display:flex;
            justify-content: flex-end;
          }
          .setting{
            display: flex;
            justify-content: flex-end;
            color:${COLOR.txt1};
          }
          .profileTopCont {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 64px;
          }
          .profileTxtCont {
            max-height: 128px;
            height: 100%;
            padding: 32px 0;
            word-break: break-all;
          }
          .profileLeftCont {
            width: 70%;
          }
          .profileInfoCont {
            display: flex;
            justify-content: space-between;
            width: 70%;
          }
          .profileImage {
            position: relative;
            border-radius: 72px;
            width: 96px;
            height: 96px;
            object-fit: cover;
            overflow: hidden;
          }
          .profileType {
            color: ${COLOR.txt3};s
          }
          .setting:hover{
            cursor:pointer;
          }
        `}
      </style>
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
