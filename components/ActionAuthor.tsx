import { useRouter } from "next/router";
import { useGlobal } from "../hooks/useGlobal";
import { IPost, SIZE } from "../libs/custom";
import IconBtn from "./atoms/IconBtn";

interface IActionAuthorProps {
  post: IPost | null | undefined;
  redirect?: string;
}

export default function ActionAuthor({ post, redirect }: IActionAuthorProps) {
  const router = useRouter();
  const { deletePost } = useGlobal();
  return post ? (
    <div>
      <div className="flex">
        <IconBtn
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
        <IconBtn
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
