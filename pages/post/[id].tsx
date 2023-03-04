import { useRouter } from "next/router";
import { IPost } from "../../libs/custom";
import React, { useEffect } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import { useUser } from "../../stores/useUser";
import CommentBox from "../../components/CommentBox";
import Motion from "../../components/wrappers/WrapMotion";
import ModifyAndDelete from "../../components/ModifyAndDelete";
import Post from "../../components/Post";
import { useCachedPage } from "../../hooks/useCachedPage";
import { useLoading } from "../../hooks/useLoading";

export default function PostPage() {
  const router = useRouter();

  const { curUser } = useUser();
  const { data, fetchPost } = useCachedPage("post");
  useLoading(["post"]);

  const pid = (router.query.id as string) || "";
  const path = router.asPath;
  const post = data[0] as IPost;

  async function fetch() {
    fetchPost && (await fetchPost({ type: "pid", value: { pid } }, path));
  }

  useEffect(() => {
    fetch();
  }, []);

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
                  <ModifyAndDelete post={post} redirect="/" />
                )}
              </div>
              <Post type="post" post={post} />
              <CommentBox
                post={post}
                user={curUser}
                onRefresh={fetch}
                className="pb-16 mx-4"
              />
            </>
          )
        )}
      </Motion>
    </>
  );
}
