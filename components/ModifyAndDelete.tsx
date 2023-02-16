import { useRouter } from "next/router";
import { deletePost } from "../apis/firebase";
import { useGlobal } from "../hooks/useGlobal";
// import { deletePost } from "../apis/firebase";
import { IPost, SIZE } from "../libs/custom";
import { useCache } from "../stores/useCache";
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

  // 왜인지는 전혀 모르겠는데 useGlobal의 deletePost를 사용하면
  // feedPage에서 infinteLoading이 작동하지 않는 현상이 있다.
  // const {deletePost} = useGlobal();
  const { deleteCachedPosts } = useCache();

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
              await deletePost(post?.id || "");
              deleteCachedPosts(post?.id || "");
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
