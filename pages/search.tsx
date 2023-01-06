import { collection, getDocs } from "firebase/firestore";
import { db } from "../apis/firebase";
import ImagePost from "../components/ImagePost";
import { IPost } from "../custom";

interface ISearchProps {
  posts: IPost[];
}

export default function Search({ posts }: ISearchProps) {
  const styleImagePost = `"calc(50% - 8px)";
    "padding-bottom": "calc(50% - 8px)";
    margin: "4px";`;
  return (
    <>
      <h1>search</h1>
      <div className="cont">
        {posts?.map((e) => {
          return (
            <ImagePost post={{ ...e, id: e.id }} style="search"></ImagePost>
          );
        })}
      </div>
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
  console.log(posts);
  return { props: { posts } };
}
