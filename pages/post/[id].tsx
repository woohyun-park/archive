import { useRouter } from "next/router";
import { getPost } from "../../apis/firebase";
import { IPost } from "../../libs/custom";
import React, { useEffect, useState } from "react";
import IconBtn from "../../components/atoms/IconBtn";
import { useUser } from "../../stores/useUser";
import CommentBox from "../../components/CommentBox";
import Motion from "../../components/wrappers/WrapMotion";
import { useModal } from "../../stores/useModal";
import { wrapPromise } from "../../stores/libStores";
import ModifyAndDelete from "../../components/ModifyAndDelete";
import Post from "../../components/Post";

export default function PostPage() {
  const { curUser } = useUser();
  const { setModalLoader } = useModal();

  const router = useRouter();
  const [post, setPost] = useState<IPost | null | undefined>(undefined);

  const pid = (router.query.id as string) || "";

  useEffect(() => {
    async function init() {
      const newPost = await getPost(pid);
      setPost(newPost);
    }
    wrapPromise(async () => {
      await init();
      setModalLoader(false);
    }, 1000);
  }, []);

  return (
    <>
      <Motion type="fade">
        {post === null ? (
          <>
            <div className="flex">
              <IconBtn icon="back" onClick={router.back} />
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
              <div className="flex items-center justify-between mb-4">
                <IconBtn icon="back" onClick={router.back} />
                {curUser.id === post.author?.id && (
                  <ModifyAndDelete post={post} redirect="/" />
                )}
              </div>
              <Post type="post" post={post} />
              <CommentBox post={post} user={curUser} setPost={setPost} />
            </>
          )
        )}
      </Motion>
    </>
  );
}
