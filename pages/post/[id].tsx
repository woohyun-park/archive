import { useRouter } from "next/router";
import { IPost } from "../../libs/custom";
import React, { useEffect, useState } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import { useUser } from "../../stores/useUser";
import CommentBox from "../../components/CommentBox";
import Motion from "../../components/wrappers/WrapMotion";
import { useModal } from "../../stores/useModal";
import { wrapPromise } from "../../stores/libStores";
import ModifyAndDelete from "../../components/ModifyAndDelete";
import Post from "../../components/Post";
import { useGlobal } from "../../hooks/useGlobal";
import { useStack } from "../../stores/useStack";

export default function PostPage() {
  const { curUser } = useUser();
  const { setModalLoader } = useModal();
  const { getPost, updatePosts } = useGlobal();
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

  useEffect(() => {
    post && updatePosts([post]);
  }, [post]);

  return (
    <>
      <Motion type="fade">
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
              <div className="flex items-center justify-between mb-4">
                <BtnIcon icon="back" onClick={router.back} />
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
