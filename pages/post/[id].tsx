import BtnIcon from "../../components/atoms/BtnIcon";
import CommentBox from "../../components/CommentBox";
import ModifyAndDelete from "../../components/ModifyAndDelete";
import Post from "../../components/Post";
import { WrapMotionFade } from "components/wrappers/motion";
import { readPost } from "apis/firebase";
import useCustomRouter from "../../hooks/useCustomRouter";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "providers";

export default function PostPage() {
  const router = useCustomRouter();
  const { id } = router.query;

  const { data: curUser } = useUser();
  const { data, refetch } = useQuery({
    queryKey: [`post/${id}`],
    queryFn: async () => await readPost(id as string),
  });

  return (
    <>
      <WrapMotionFade className="bg-white">
        {data === null ? (
          <>
            <div className="flex">
              <BtnIcon icon="back" onClick={router.back} />
            </div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
              존재하지 않는 페이지입니다
            </div>
          </>
        ) : data === undefined ? (
          <></>
        ) : (
          data.author !== undefined && (
            <>
              <div className="flex items-center justify-between m-4">
                <BtnIcon icon="back" onClick={router.back} />
                {curUser.id === data.author?.id && (
                  <ModifyAndDelete post={data} />
                )}
              </div>
              <Post post={data} />
              <CommentBox
                post={data}
                user={curUser}
                onRefresh={async () => await refetch()}
                className="pb-16 mx-4"
              />
            </>
          )
        )}
      </WrapMotionFade>
    </>
  );
}
