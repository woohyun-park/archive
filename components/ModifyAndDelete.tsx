import { IPost, SIZE } from "../apis/def";

import BtnIcon from "./atoms/BtnIcon";
import { deletePost } from "../apis/firebase/fbDelete";
import { useCustomRouter } from "hooks";
import { useStatus } from "../stores/useStatus";

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
              //refetch
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
