import { db } from "../apis/firebase";
import { collection, getDocs } from "firebase/firestore";
import { IPost } from "../custom";
import Feed from "./feed";

interface IIndex {
  posts: IPost[];
}

export default function Index({ posts }: IIndex) {
  return <Feed posts={posts} />;
}

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts: IPost[] = [];
  querySnapshot.forEach((doc) => {
    posts.push({ ...doc.data(), id: doc.id } as IPost);
  });
  return { props: { posts } };
}
