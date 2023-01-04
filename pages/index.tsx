import { db } from "../apis/firebase";
import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import FeedPost from "../components/FeedPost";
import { useEffect, useState } from "react";

// const posts: Post[] = [
//   {
//     id: 0,
//     user: {
//       name: "iamdooddi",
//       img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
//     },
//     title: "노티드",
//     tags: ["카페", "도넛", "디저트"],
//     imgs: [
//       "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891643/archive/static/carousel_temp.png",
//     ],
//     color: "",
//     createdAt: "6시간 전",
//     numLikes: 0,
//     arrLikes: [],
//     numComments: 0,
//     arrComments: [],
//   },
//   {
//     id: 1,
//     user: {
//       name: "blugalore",
//       img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
//     },
//     title: "오래 속삭여도 좋을 이야기",
//     tags: ["시집", "문학동네", "이은규"],
//     imgs: [],
//     color: "#EC6B71",
//     createdAt: "1일 전",
//     numLikes: 0,
//     arrLikes: [],
//     numComments: 0,
//     arrComments: [],
//   },
// ];

export default function Feed() {
  // (async () => {
  //   await addDoc(collection(db, "posts"), {
  //     id: 1,
  //     user: {
  //       name: "blugalore",
  //       img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
  //     },
  //     title: "오래 속삭여도 좋을 이야기",
  //     tags: ["시집", "문학동네", "이은규"],
  //     imgs: [],
  //     color: "#EC6B71",
  //     createdAt: "1일 전",
  //     numLikes: 0,
  //     arrLikes: [],
  //     numComments: 0,
  //     arrComments: [],
  //   });
  // })();
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
      {posts.map((e) => (
        <FeedPost docData={e} />
      ))}
      <div className="space"></div>
      <style jsx>
        {`
          .space {
            height: 72px;
          }
        `}
      </style>
    </>
  );
}
