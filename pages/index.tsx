import { db, getData } from "../apis/firebase";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { IPost, IUser } from "../custom";
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
  postSnap.forEach((postSnapEach) => {
    if (postSnapEach.data().isDeleted) {
      return;
    }
    posts.push({
      ...postSnapEach.data(),
      createdAt: postSnapEach.data().createdAt.toDate(),
      id: postSnapEach.id,
    } as IPost);
    uids.push(postSnapEach.data().uid);
  });
  const users: IUser[] = [];
  for await (const uid of uids) {
    const user = (await getData("users", uid)) as IUser;
    users.push(user);
  }
  return { props: { posts, users } };
}
