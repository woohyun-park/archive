import { useRouter } from "next/router";
import { HiPencil, HiX } from "react-icons/hi";
import { SIZE, IPost } from "../custom";

interface IModifyProps {
  post: IPost;
}

export default function Modify({ post }: IModifyProps) {
  const router = useRouter();
  function handleModify() {
    router.push(
      {
        pathname: "/add",
        query: { post: JSON.stringify(post) },
      },
      "/modify"
    );
  }

  return (
    <>
      <div className="hover:cursor-pointer" onClick={handleModify}>
        <HiPencil size={SIZE.iconSm} />
      </div>
    </>
  );
}
