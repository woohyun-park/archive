import { useCustomRouter } from "hooks";
import { IPost } from "types/common";
import { deletePost } from "../apis/firebase/fbDelete";
import { Icon } from "./atoms";

interface IModifyAndDeleteProps {
  post: IPost | null | undefined;
}

export default function ModifyAndDelete({ post }: IModifyAndDeleteProps) {
  const router = useCustomRouter();

  return post ? (
    <div>
      <div className="flex">
        <Icon
          icon="modify"
          size="sm"
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
          size="sm"
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
