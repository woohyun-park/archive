import { useRouter } from "next/router";
import { IPost } from "../libs/custom";
import { useModal } from "../stores/useModal";

interface IPostTitle {
  post: IPost;
}

export default function PostTitle({ post }: IPostTitle) {
  const router = useRouter();

  const storage = globalThis?.sessionStorage;
  const prevPath = storage.getItem("prevPath");
  const currentPath = storage.getItem("currentPath");

  const { setModalLoader } = useModal();
  return (
    <div
      className="mt-4 mb-4 text-5xl font-bold break-words hover:cursor-pointer w-fit"
      onClick={() => {
        prevPath !== currentPath && setModalLoader(true);
        router.push(`/post/${post.id}`);
      }}
    >
      {post.title}
    </div>
  );
}
