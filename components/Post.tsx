import Image from "next/image";
import { useRouter } from "next/router";
import { IPost, IUser } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import Action from "./Action";
import PostBox from "./PostBox";
import Profile from "./Profile";
import WrapMotion from "./wrappers/WrapMotion";
import { Children } from "react";
import Btn from "./atoms/Btn";
import useCustomRouter from "../hooks/useCustomRouter";

interface IPostProps {
  type: "feed" | "post";
  post: IPost;
}

export default function Post({ type, post }: IPostProps) {
  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const router = useCustomRouter();

  function Title() {
    return (
      <div
        className="p-4 text-5xl font-bold break-words hover:cursor-pointer w-fit"
        onClick={() => {
          router.asPath !== `/post/${post.id}` && setModalLoader(true);
          router.push(`/post/${post.id}`);
        }}
      >
        {post.title}
      </div>
    );
  }

  function Tags() {
    return (
      <div className="flex flex-wrap justify-end w-full px-4">
        {Children.toArray(
          post.tags.map((tag, i) => (
            <Btn
              label={`#${tag}`}
              className="px-2"
              onClick={() => router.pushWithLoader(`/tag/${tag}`)}
            />
          ))
        )}
      </div>
    );
  }

  return (
    <>
      {post.author ? (
        type === "feed" ? (
          <>
            <WrapMotion type="float" className="px-4 py-1 bg-white">
              <Profile
                post={post}
                user={post.author as IUser}
                info="time"
                action={curUser.id === post.uid ? "modifyAndDelete" : undefined}
              />
              <PostBox post={post} type="noText" />
              <Title />
              <Tags />
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
            </WrapMotion>
          </>
        ) : type === "post" ? (
          <>
            {post.imgs.length === 0 ? (
              <div className="w-full pb-[50%]" id="post_d1"></div>
            ) : (
              <div className="relative pb-[100%] w-full overflow-hidden">
                <Image
                  src={post.imgs[0]}
                  alt=""
                  className="object-cover"
                  fill
                />
              </div>
            )}
            {curUser.id === post.uid ? (
              <Profile
                post={post}
                user={post.author}
                info="time"
                className="mx-4"
              />
            ) : (
              <Profile
                post={post}
                user={post.author}
                info="time"
                action="follow"
                className="mx-4"
              />
            )}
            <Title />
            <Tags />
            <div className="mx-4 mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      <style jsx>{`
        #post_d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
