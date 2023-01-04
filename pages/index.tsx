import { db } from "../apis/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import FeedPost from "../components/FeedPost";
import { useEffect, useState } from "react";

export default function Feed() {
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  async function getPosts() {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((doc) => {
      result.push(doc);
    });
    setPosts(result);
  }
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <h1>feed</h1>
      {posts.map((e) => {
        return <FeedPost docData={e} key={e.id} />;
      })}
      <style jsx>{``}</style>
    </>
  );
}
