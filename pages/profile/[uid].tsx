import { signOut } from "firebase/auth";
import {
  collection,
  doc,
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
import Button from "../../components/Button";

interface IProfileProps {
  uid: string;
  posts: IPost[];
}

export default function Profile({ uid, posts }: IProfileProps) {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [user, setUser] = useState<IUser | null>(null);
  async function getUser() {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const tempUser = { ...(userSnap.data() as IUser), uid };
    console.log(tempUser.followers);
    setUser(tempUser);
  }
  useEffect(() => {
    console.log("useEffect");
    getUser();
  }, [curUser]);
  function getFollowNum(obj: IDict<boolean>) {
    let result = 0;
    for (const key in obj) {
      if (obj[key]) {
        result++;
      }
    }
    return result;
  }
  function handleLogout() {
    signOut(auth);
  }
  async function handleFollow() {
    const tempCurUserFollowings = {
      ...(curUser.followings as IDict<boolean>),
      [uid]: !curUser.followings[uid],
    };
    const tempCurUser = { ...curUser, followings: tempCurUserFollowings };
    setCurUser(tempCurUser);
    updateCurUser(tempCurUser);

    const userRef = doc(db, "users", uid);
    const tempUserFollowers = {
      ...(user?.followers as IDict<boolean>),
      [curUser.uid]: !user?.followers[curUser.uid],
    };
    const tempUser = { ...user, followers: tempUserFollowers };
    await updateDoc(userRef, tempUser);
  }
  useEffect(() => {
    console.log("changed");
  }, [curUser]);
  return (
    <>
      {uid === curUser.uid && (
        <Link href="/setting">
          <div className="setting">
            <HiOutlineCog size={SIZE.icon} />
          </div>
        </Link>
      )}
      <div className="profileTopCont">
        <div className="profileLeftCont">
          <h1>
            {uid === curUser.uid ? curUser.displayName : user?.displayName}
          </h1>
          <div className="profileInfoCont">
            <div>
              <div className="profileType">아카이브</div>
              <div className="profileNum">{user?.posts.length}</div>
            </div>
            <div>
              <div className="profileType">팔로워</div>
              <div className="profileNum">
                {user && getFollowNum(user.followers)}
              </div>
            </div>
            <div>
              <div className="profileType">팔로잉</div>
              <div className="profileNum">
                {user && Object.keys(user.followings).length}
              </div>
            </div>
          </div>
        </div>
        <img
          className="profileImage"
          src={uid === curUser.uid ? curUser.photoURL : user?.photoURL}
        />
      </div>
      {(() => {
        const result = [];
        if (curUser.uid !== uid) {
          if (curUser.followings[uid]) {
            result.push(
              <button onClick={handleFollow} className="g-button2">
                팔로잉
              </button>
            );
          } else {
            result.push(
              <button onClick={handleFollow} className="g-button1">
                팔로우
              </button>
            );
          }
        }
        return result;
      })()}
      <div className="profileTxtCont">
        {uid === curUser.uid ? curUser.txt : user?.txt}
      </div>
      {uid === curUser.uid ? (
        <>
          <button onClick={handleLogout} className="g-button1">
            logout
          </button>
        </>
      ) : (
        <></>
      )}

      <List data={{ grid: posts, tag: [], scrap: [] }} style="profile" />
      <style jsx>
        {`
          h1 {
            margin-top: 0;
            word-break: break-all;
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
  const posts: IPost[] = [];
  postSnap.forEach((doc) => {
    posts.push({ ...(doc.data() as IPost), id: doc.id });
  });

  return { props: { uid, posts } };
}
