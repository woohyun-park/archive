import { collection, getDocs } from "firebase/firestore";
import { db } from "../apis/firebase";
import Image from "../components/Image";
import List from "../components/List";
import { IPost } from "../custom";

interface ISearchProps {
  posts: IPost[];
}

export default function Search({ posts }: ISearchProps) {
  return (
    <>
      <h1>search</h1>
      <List posts={posts} style="search" />
      <style jsx>{`
        .cont {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts: IPost[] = [];
  querySnapshot.forEach((doc) => {
    posts.push({ ...doc.data(), id: doc.id } as IPost);
  });
  return { props: { posts } };
}
