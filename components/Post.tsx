import Link from "next/link";
import { useRouter } from "next/router";
import { Children } from "react";
import { IPost, IUser } from "../libs/custom";
import { useModal } from "../stores/useModal";
import { useUser } from "../stores/useUser";
import Action from "./Action";
import PostBox from "./PostBox";
import PostImg from "./PostImg";
import PostTag from "./PostTag";
import PostTitle from "./PostTitle";
import ProfileSmall from "./ProfileSmall";
import WrapMotion from "./wrappers/WrapMotion";
import WrapScroll from "./wrappers/WrapScroll";

interface IPostProps {
  type: "feed" | "post";
  post: IPost;
}

export default function Post({ type, post }: IPostProps) {
  const { curUser } = useUser();
  const { setModalLoader } = useModal();

  const router = useRouter();

  return (
    <>
      {post.author ? (
        type === "feed" ? (
          <>
            <WrapMotion type="float" className="px-4 py-1 bg-white">
              <WrapScroll>
                <ProfileSmall
                  post={post}
                  user={post.author as IUser}
                  type="post"
                />
                <PostBox post={post} />
                <PostTitle post={post} />
                <div className="bottom-0 right-0 flex flex-row-reverse flex-wrap-reverse text-left ">
                  {Children.toArray(
                    [...post.tags]?.reverse().map((tag) => (
                      <Link href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                        <button className="m-1 mb-0 button-black hover:cursor-pointer">{`#${tag}`}</button>
                      </Link>
                    ))
                  )}
                </div>
                <Action
                  post={post}
                  curUser={curUser}
                  onCommentClick={() => {
                    setModalLoader(true);
                    router.push(
                      {
                        pathname: `/post/${post.id}`,
                        query: { isCommentFocused: true },
                      },
                      `/post/${post.id}`
                    );
                  }}
                />
              </WrapScroll>
            </WrapMotion>
          </>
        ) : type === "post" ? (
          <>
            <PostImg imgs={post.imgs} color={post.color} />
            <ProfileSmall post={post} user={post.author} type="post" />
            <PostTitle post={post} />
            <PostTag tags={post.tags} />
            <div className="mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
}
