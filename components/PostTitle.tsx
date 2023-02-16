import { useRouter } from "next/router";
import { IPost } from "../libs/custom";
import { useModal } from "../stores/useModal";

interface IPostTitle {
  post: IPost;
}

export default function PostTitle({ post }: IPostTitle) {
  const router = useRouter();
  const { setModalLoader } = useModal();
  return (
    <div
      className="mt-4 mb-4 text-5xl font-bold break-words hover:cursor-pointer w-fit"
      onClick={() => {
        setModalLoader(true);
        router.push(
          {
            pathname: `/post/${post.id}`,
            query: { post: JSON.stringify(post) },
          },
          `/post/${post.id}`
        );
      }}
    >
      {post.title}
    </div>
  );
}
