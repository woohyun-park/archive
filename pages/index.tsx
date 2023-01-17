import { db, getData, getDataByQuery } from "../apis/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IComment, ILike, IPost, IScrap, ITag, IUser } from "../custom";
import Feed from "./feed";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";

export default function Index() {
  const { curUser } = useStore();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    init();
  }, []);
  async function init() {
    console.log("here");
    if (curUser.followings.length === 0) {
      return;
    }
    const q = query(
      collection(db, "posts"),
      where("uid", "in", [...curUser.followings, curUser.id]),
      orderBy("createdAt", "desc"),
      limit(page * 5)
    );

    // const postSnap = await getDocs(collection(db, "posts"));
    const postSnap = await getDocs(q);
    console.log(postSnap);
    const newPosts: IPost[] = [];
    const uids: string[] = [];
    postSnap.forEach((doc) => {
      newPosts.push({
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as IPost);
      uids.push(doc.data().uid);
    });
    for await (const post of newPosts) {
      const likes = await getDataByQuery<ILike>(
        "likes",
        "pid",
        "==",
        post.id || ""
      );
      const scraps = await getDataByQuery<IScrap>(
        "scraps",
        "pid",
        "==",
        post.id || ""
      );
      const comments = await getDataByQuery<IComment>(
        "comments",
        "pid",
        "==",
        post.id || ""
      );
      if (likes) {
        post.likes = likes;
      } else {
        post.likes = [];
      }
      if (scraps) {
        post.scraps = scraps;
      } else {
        post.scraps = [];
      }
      if (comments) {
        post.comments = comments;
      } else {
        post.comments = [];
      }
    }
    const newUsers: IUser[] = [];
    for await (const uid of uids) {
      const user = await getData<IUser>("users", uid);
      newUsers.push(user);
    }
    setPosts(newPosts);
    setUsers(newUsers);
  }
  return <Feed posts={posts} users={users} />;
}
