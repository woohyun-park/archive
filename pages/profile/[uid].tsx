import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../apis/firebase";
import List from "../../components/List";
import { COLOR, IPost, IUser, SIZE } from "../../custom";
import { HiOutlineCog } from "react-icons/hi";
import { useStore } from "../../apis/zustand";
import Link from "next/link";
import { useEffect } from "react";
import Button from "../../components/Button";

interface IProfileProps {
  user: IUser;
  posts: IPost[];
}

export default function Profile({ user, posts }: IProfileProps) {
  const { curUser } = useStore();
  function handleLogout() {
    signOut(auth);
  }
  return (
    <>
      {user.uid === curUser.uid && (
        <Link href="/setting">
          <div className="setting">
            <HiOutlineCog size={SIZE.icon} />
          </div>
        </Link>
      )}
      <div className="profileTopCont">
        <div className="profileLeftCont">
          <h1>
            {user.uid === curUser.uid ? curUser.displayName : user.displayName}
          </h1>
          <div className="profileInfoCont">
            <div>
              <div className="profileType">아카이브</div>
              <div className="profileNum">{user.posts.length}</div>
            </div>
            <div>
              <div className="profileType">팔로워</div>
              <div className="profileNum">{user.followers.length}</div>
            </div>
            <div>
              <div className="profileType">팔로잉</div>
              <div className="profileNum">{user.followings.length}</div>
            </div>
          </div>
        </div>
        <img
          className="profileImage"
          src={user.uid === curUser.uid ? curUser.photoURL : user.photoURL}
        />
      </div>
      <div className="profileTxtCont">
        {user.uid === curUser.uid ? curUser.txt : user.txt}
      </div>
      {user.uid === curUser.uid ? (
        <>
          <button onClick={handleLogout} className="g-button">
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
            min-height: 64px;
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
  const userRef = doc(db, "users", params.uid);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();

  const postRef = collection(db, "posts");
  const postSnap = await getDocs(
    query(postRef, where("uid", "==", params.uid))
  );
  const posts: IPost[] = [];
  postSnap.forEach((doc) => {
    posts.push({ ...(doc.data() as IPost), id: doc.id });
  });

  return { props: { user, posts } };
}
