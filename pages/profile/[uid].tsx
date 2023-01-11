import { signOut } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  FieldPath,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../apis/firebase";
import List from "../../components/List";
import { COLOR, IDict, IPost, IUser, SIZE } from "../../custom";
import { HiOutlineCog } from "react-icons/hi";
import { useStore } from "../../apis/zustand";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IProfileProps {
  initUser: IUser;
  initPosts: IPost[];
  initScraps: IPost[];
}

export default function Profile({
  initUser,
  initPosts,
  initScraps,
}: IProfileProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [user, setUser] = useState<IUser>(initUser);
  const [posts, setPosts] = useState(initPosts);
  const [scraps, setScraps] = useState(initScraps);
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem) => elem === user.uid) ? true : false
  );
  console.log(initUser, initPosts, initScraps);

  useEffect(() => {
    update();
  }, [curUser]);

  async function update() {
    if (curUser.uid === user.uid) {
      setUser(curUser);
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const tempUser = { ...(userSnap.data() as IUser), uid: user.uid };
    setUser(tempUser);
  }

  function handleLogout() {
    signOut(auth);
  }

  async function handleToggleFollow() {
    console.log("handleToggleFollow");
    const curUserRef = doc(db, "users", curUser.uid);
    const userRef = doc(db, "users", user.uid);
    if (isFollowing) {
      await updateDoc(curUserRef, { followings: arrayRemove(user.uid) });
      await updateDoc(userRef, {
        followers: arrayRemove(curUser.uid),
      });
    } else {
      await updateDoc(curUserRef, {
        followings: arrayUnion(user.uid),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(curUser.uid),
      });
    }

    const tempFollowings = new Set(curUser.followings);
    if (isFollowing) {
      tempFollowings.delete(user.uid);
    } else {
      tempFollowings.add(user.uid);
    }
    const followings = Array.from(tempFollowings) as string[];
    setCurUser({ ...curUser, followings });
    updateCurUser({ ...curUser, followings });

    setIsFollowing(!isFollowing);
  }

  return (
    <>
      {user.uid === curUser.uid && (
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
          <h1>{user?.displayName}</h1>
          <div className="profileInfoCont">
            <div>
              <div className="profileType">아카이브</div>
              <div className="profileNum">{user?.posts.length}</div>
            </div>
            <div>
              <div className="profileType">팔로워</div>
              <div className="profileNum">{user?.followers.length}</div>
            </div>
            <div>
              <div className="profileType">팔로잉</div>
              <div className="profileNum">{user?.followings.length}</div>
            </div>
          </div>
        </div>
        <img className="profileImage" src={user?.photoURL} />
      </div>
      {(() => {
        const result = [];
        if (curUser.uid !== user.uid) {
          if (curUser.followings.find((elem) => elem === user.uid)) {
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
      <div className="profileTxtCont">{user?.txt}</div>
      {user.uid === curUser.uid ? (
        <>
          <button onClick={handleLogout} className="g-button1">
            로그아웃
          </button>
        </>
      ) : (
        <></>
      )}
      <List data={{ grid: posts, tag: [], scrap: scraps }} style="profile" />

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
            border-radius: 72px;
            width: 96px;
            height: 96px;
            object-fit: cover;
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
  const pathsSnap = await getDocs(collection(db, "users"));
  const paths: IServerSidePaths[] = [];
  pathsSnap.forEach((path) => {
    paths.push({ params: { uid: path.id } });
  });

  return { paths, fallback: false };
}

export async function getServerSideProps({ params }: IServerSidePaths) {
  const uid = params.uid;
  const postRef = collection(db, "posts");
  const postSnap = await getDocs(
    query(postRef, where("uid", "==", params.uid))
  );
  const initPosts: IPost[] = [];
  postSnap.forEach((doc) => {
    initPosts.push({
      ...(doc.data() as IPost),
      createdAt: doc.data().createdAt.toDate(),
      id: doc.id,
    });
  });

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const initUser: IUser = { ...(userSnap.data() as IUser), uid: userSnap.id };

  // scraps가 []인 경우에는 where()에서 "in"을 사용할 시 에러가 난다.
  if (initUser.scraps.length === 0) {
    const initScraps: IPost[] = [];
    return { props: { initUser, initPosts, initScraps } };
  }

  const scrapSnap = await getDocs(
    query(postRef, where("id", "in", initUser.scraps))
  );
  const initScraps: IPost[] = [];
  scrapSnap.forEach((doc) => {
    initScraps.push({
      ...(doc.data() as IPost),
      createdAt: doc.data().createdAt.toDate(),
      id: doc.id,
    });
  });

  return { props: { initUser, initPosts, initScraps } };
}
