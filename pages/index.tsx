import { db, getData, getDataByQuery } from "../apis/firebase";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { IComment, ILike, IPost, IScrap, ITag, IUser } from "../custom";
import Feed from "./feed";

interface IIndex {
  posts: IPost[];
  users: IUser[];
}

export default function Index({ posts, users }: IIndex) {
  return <Feed posts={posts} users={users} />;
}

export async function getServerSideProps() {
  const postSnap = await getDocs(collection(db, "posts"));
  const posts: IPost[] = [];
  const uids: string[] = [];
  postSnap.forEach((doc) => {
    posts.push({
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    } as IPost);
    uids.push(doc.data().uid);
  });
  for await (const post of posts) {
    const tags = await getDataByQuery("tags", "pid", "==", post.id || "");
    const likes = await getDataByQuery("likes", "pid", "==", post.id || "");
    const scraps = await getDataByQuery("scraps", "pid", "==", post.id || "");
    const comments = await getDataByQuery(
      "comments",
      "pid",
      "==",
      post.id || ""
    );
    if (tags) {
      post.tags = tags as ITag[];
    } else {
      post.tags = [];
    }
    if (likes) {
      post.likes = likes as ILike[];
    } else {
      post.likes = [];
    }
    if (scraps) {
      post.scraps = likes as IScrap[];
    } else {
      post.scraps = [];
    }
    if (comments) {
      post.comments = likes as IComment[];
    } else {
      post.comments = [];
    }
  }
  const users: IUser[] = [];
  for await (const uid of uids) {
    const user = (await getData("users", uid)) as IUser;
    users.push(user);
  }
  return { props: { posts, users } };
}
