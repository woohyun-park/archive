import { db } from "../apis/firebase";
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
    posts.push({ ...postSnapEach.data(), id: postSnapEach.id } as IPost);
    uids.push(postSnapEach.data().uid);
  });
  const users: IUser[] = [];
  for await (const uid of uids) {
    const userSnap = await getDoc(doc(db, "users", uid));
    users.push({ ...(userSnap.data() as IUser), uid: userSnap.id });
  }

  return { props: { posts, users } };
}
