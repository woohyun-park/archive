import { IPost, SIZE } from "../apis/def";

import { Icon } from "./atoms";
import { deletePost } from "../apis/firebase/fbDelete";
import { useCustomRouter } from "hooks";
import { useStatus } from "../stores/useStatus";

interface IModifyAndDeleteProps {
  post: IPost | null | undefined;
}

export default function ModifyAndDelete({ post }: IModifyAndDeleteProps) {
  const router = useCustomRouter();

  const { setRefresh } = useStatus();

  return post ? (
    <div>
      <div className="flex">
        <Icon
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
        <Icon
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
