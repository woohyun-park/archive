import Link from "next/link";
import { IPost } from "../../libs/custom";

interface ITitle {
  post: IPost;
}

export default function PostTitle({ post }: ITitle) {
  return (
    <Link
      href={{
        pathname: `/post/${post.id}`,
        query: { post: JSON.stringify(post) },
      }}
      as={`/post/${post.id}`}
      legacyBehavior
    >
      <div className="mt-4 mb-4 text-5xl font-bold break-words hover:cursor-pointer w-fit">
        {post.title}
      </div>
    </Link>
  );
}
