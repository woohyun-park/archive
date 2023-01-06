import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../../apis/firebase";
import { useStore } from "../../apis/zustand";
import ImagePost from "../../components/ImagePost";
import { COLOR, IPost, IUser } from "../../custom";

interface IProfileProps {
  user: IUser;
  posts: IPost[];
}

export default function Profile({ user, posts }: IProfileProps) {
  const { curUser, setCurUser } = useStore();
  const [selected, setSelected] = useState(1);
  function handleLogout() {
    signOut(auth);
  }
  return (
    <>
      <div className="profileTopCont">
        <div className="profileLeftCont">
          <h1>{user.displayName}</h1>
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
        <img className="profileImage" src={user.photoURL} />
      </div>
      <div className="profileTextCont">{user.txt}</div>
      <div className="postTypes">
        <div onClick={() => setSelected(1)}>grid</div>
        <div onClick={() => setSelected(2)}>tag</div>
        <div onClick={() => setSelected(3)}>scrap</div>
      </div>
      <div className="postCont">
        {selected === 1 ? (
          posts?.map((e) => {
            return (
              <ImagePost post={{ ...e, id: e.id }} size="small"></ImagePost>
            );
          })
        ) : selected === 2 ? (
          // Posts by tag
          <></>
        ) : (
          // Posts by scrap
          <></>
        )}
      </div>
      <button onClick={handleLogout}>logout</button>
      <style jsx>
        {`
          h1 {
            margin-top: 0;
            word-break: break-all;
          }
          .profileTopCont {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 22px;
          }
          .profileTextCont {
            height: 64px;
            padding: 32px 0;
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
            color: ${COLOR.txt3};
          }
          .postTypes {
            display: flex;
            justify-content: space-around;
            margin-bottom: 16px;
          }
          .postTypes > div {
            width: 100%;
            text-align: center;
            border-bottom: 1px solid ${COLOR.txt3};
            padding: 8px 0;
          }
          .postTypes > div:hover {
            cursor: pointer;
          }
          .postTypes > div:nth-of-type(${selected}) {
            font-weight: 800;
            border-bottom: 2px solid ${COLOR.txt1};
          }
          .postCont {
            display: flex;
            flex-wrap: wrap;
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
