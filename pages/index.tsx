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
  const { gCurUser, gPosts, gUsers, gSetPostsAndUsers } = useStore();
  console.log(gCurUser, gPosts, gUsers);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    // gSetPostsAndUsers(gCurUser, page);
  }, []);
  return <Feed posts={gPosts} users={gUsers} />;
}
