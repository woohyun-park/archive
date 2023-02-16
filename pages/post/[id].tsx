import { useRouter } from "next/router";
import { getPost } from "../../apis/firebase";
import ProfileSmall from "../../components/ProfileSmall";
import { IPost, SIZE } from "../../libs/custom";
import React, { Children, useEffect, useState } from "react";
import IconBtn from "../../components/atoms/IconBtn";
import { useUser } from "../../stores/useUser";
import PostTitle from "../../components/atoms/PostTitle";
import CommentBox from "../../components/CommentBox";
import Motion from "../../components/wrappers/WrapMotion";
import { useModal } from "../../stores/useModal";
import { useGlobal } from "../../hooks/useGlobal";
import { wrapPromise } from "../../stores/libStores";
import PostImg from "../../components/atoms/PostImg";
import PostTags from "../../components/atoms/PostTags";
import ActionAuthor from "../../components/ActionAuthor";

export default function Post() {
  const { curUser } = useUser();
  const router = useRouter();
  const [post, setPost] = useState<IPost | null | undefined>(undefined);
  const { setModalLoader } = useModal();
  const { deletePost } = useGlobal();

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

  function handleModify() {
    router.push(
      {
        pathname: "/add",
        query: { post: JSON.stringify(post) },
      },
      "/modify"
    );
  }

  async function handleDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      deletePost(post?.id as string);
      alert("삭제되었습니다");
    } else {
      console.log(post);
    }
    router.push("/");
  }

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
                  <ActionAuthor post={post} redirect="/" />
                )}
              </div>
              <PostImg imgs={post.imgs} color={post.color} />
              <ProfileSmall post={post} user={post.author} type="post" />
              <PostTitle post={post} />
              <PostTags tags={post.tags} />
              <div className="mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
              <CommentBox post={post} user={curUser} setPost={setPost} />
            </>
          )
        )}
      </Motion>
    </>
  );
}
