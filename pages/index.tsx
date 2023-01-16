import { db, getData, getDataByQuery } from "../apis/firebase";
import { collection, getDocs } from "firebase/firestore";
import { IComment, ILike, IPost, IScrap, ITag, IUser } from "../custom";
import Feed from "./feed";
import { GetServerSidePropsContext } from "next";

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
  const users: IUser[] = [];
  for await (const uid of uids) {
    const user = await getData<IUser>("users", uid);
    users.push(user);
  }
  return { props: { posts, users } };
}
