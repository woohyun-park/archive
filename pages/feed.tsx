import PostFeed from "../components/PostFeed";
import { IPost } from "../custom";

interface IFeed {
  posts: IPost[];
}

export default function Feed({ posts }: IFeed) {
  return (
    <>
      <h1>feed</h1>
      {posts.map((post) => {
        return <PostFeed post={post} key={post.id} />;
      })}
      <style jsx>{``}</style>
    </>
  );
}
