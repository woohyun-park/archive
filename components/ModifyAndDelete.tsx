import { deletePost } from "../apis/firebase/fbDelete";
import { IPost, SIZE } from "../apis/def";
import { useCache } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";
import BtnIcon from "./atoms/BtnIcon";
import { useCustomRouter } from "hooks";

interface IModifyAndDeleteProps {
  post: IPost | null | undefined;
  // redirect?: string;
}

export default function ModifyAndDelete({
  post,
}: // redirect,
IModifyAndDeleteProps) {
  const router = useCustomRouter();

  const { setRefresh } = useStatus();
  const { deleteCachedPost } = useCache();

  return post ? (
    <div>
      <div className="flex">
        <BtnIcon
          icon="modify"
          size={SIZE.iconSm}
          onClick={() => {
            router.push(
              {
                pathname: "/modify",
                query: { post: JSON.stringify(post) },
              },
              "/modify"
            );
          }}
        />
        <BtnIcon
          icon="delete"
          size={SIZE.iconSm}
          onClick={async () => {
            if (confirm("정말 삭제하시겠습니까?")) {
              await deletePost(post?.id || "");
              deleteCachedPost(router.asPath, "posts", post.id);
            } else {
              console.log(post?.id);
            }
            router.push("/");
          }}
        />
      </div>
    </div>
  ) : (
    <></>
  );
}
