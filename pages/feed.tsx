import PostFeed from "../components/PostFeed";
import { IPost, IUser } from "../custom";

interface IFeed {
  posts: IPost[];
  users: IUser[];
}

export default function Feed({ posts, users }: IFeed) {
  return (
    <>
      <h1>피드</h1>
      {posts.map((post, i) => {
        return <PostFeed post={post} user={users[i]} key={post.id} />;
      })}
    </>
  );
}
