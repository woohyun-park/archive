import { signOut } from "firebase/auth";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import FeedPost from "../components/FeedPost";
import ImageFeed from "../components/ImageFeed";
import { IPost } from "../custom";

export default function Profile() {
  const [posts, setPosts] = useState<IPost[]>([]);
  async function getPosts() {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("uid", "==", user.uid));
    const snap = await getDocs(q);
    const tempPosts: IPost[] = [];
    snap.forEach((doc) => {
      tempPosts.push(doc.data() as IPost);
    });
    setPosts(tempPosts);
  }
  useEffect(() => {
    getPosts();
  }, []);

  const { user, setUser } = useStore();
  function handleLogout() {
    signOut(auth);
  }
  return (
    <>
      <h1>{user.displayName}</h1>
      <button onClick={handleLogout}>logout</button>
      <div className="postCont">
        {posts.map((e) => (
          <ImageFeed post={e} size="small"></ImageFeed>
        ))}
      </div>
      <style jsx>
        {`
          .postCont {
            display: flex;
            flex-wrap: wrap;
          }
        `}
      </style>
    </>
  );
}
