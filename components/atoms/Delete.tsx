import { useRouter } from "next/router";
import { HiX } from "react-icons/hi";
import { deletePost } from "../../apis/firebase";
import { SIZE } from "../../libs/custom";

interface IDeleteProps {
  id: string;
}

export default function Delete({ id }: IDeleteProps) {
  const router = useRouter();
  async function handleDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deletePost(id);
      alert("삭제되었습니다");
    } else {
      console.log(id);
    }
    router.push("/");
  }
  return (
    <>
      <div className="hover:cursor-pointer" onClick={handleDelete}>
        <HiX size={SIZE.iconSm} />
      </div>
    </>
  );
}
