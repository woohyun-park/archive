import { useRouter } from "next/router";
import { IPost } from "../../apis/custom";
import React from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import { useUser } from "../../stores/useUser";
import CommentBox from "../../components/CommentBox";
import Motion from "../../components/wrappers/WrapMotion";
import ModifyAndDelete from "../../components/ModifyAndDelete";
import Post from "../../components/Post";
import { useCachedPage } from "../../hooks/useCachedPage";
import { useLoading } from "../../hooks/useLoading";
import useCustomRouter from "../../hooks/useCustomRouter";

export default function PostPage() {
  const router = useCustomRouter();

  const { curUser } = useUser();
  const { data, onRefresh } = useCachedPage("post", {
    type: "pid",
    value: { pid: (router.query.id as string) || "" },
  });
  useLoading(["post"]);

  const post = data ? (data[0] as IPost) : null;

  return (
    <>
      <Motion type="fade" className="bg-white">
        {post === null ? (
          <>
            <div className="flex">
              <BtnIcon icon="back" onClick={router.back} />
            </div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
              존재하지 않는 페이지입니다
            </div>
          </>
        ) : post === undefined ? (
          <></>
        ) : (
          post.author !== undefined && (
            <>
              <div className="flex items-center justify-between m-4">
                <BtnIcon icon="back" onClick={router.back} />
                {curUser.id === post.author?.id && (
                  <ModifyAndDelete post={post} />
                )}
              </div>
              <Post post={post} />
              <CommentBox
                post={post}
                user={curUser}
                onRefresh={onRefresh}
                className="pb-16 mx-4"
              />
            </>
          )
        )}
      </Motion>
    </>
  );
}
