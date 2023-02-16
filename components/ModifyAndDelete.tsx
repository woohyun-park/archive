import { useRouter } from "next/router";
import { useGlobal } from "../hooks/useGlobal";
import { IPost, SIZE } from "../libs/custom";
import BtnIcon from "./atoms/BtnIcon";

interface IModifyAndDeleteProps {
  post: IPost | null | undefined;
  redirect?: string;
}

export default function ModifyAndDelete({
  post,
  redirect,
}: IModifyAndDeleteProps) {
  const router = useRouter();
  const { deletePost } = useGlobal();
  return post ? (
    <div>
      <div className="flex">
        <BtnIcon
          icon="modify"
          size={SIZE.iconSm}
          onClick={() => {
            router.push(
              {
                pathname: "/add",
                query: { post: JSON.stringify(post) },
              },
              "/modify"
            );
          }}
        />
        <BtnIcon
          icon="delete"
          size={SIZE.icon}
          onClick={async () => {
            if (confirm("정말 삭제하시겠습니까?")) {
              deletePost(post?.id || "");
            } else {
              console.log(post?.id);
            }
            redirect && router.push(redirect);
          }}
        />
      </div>
    </div>
  ) : (
    <></>
  );
}
