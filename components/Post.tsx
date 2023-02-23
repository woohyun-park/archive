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
import WrapLink from "./wrappers/WrapLink";

interface IPostProps {
  type: "feed" | "post";
  post: IPost;
}

export default function Post({ type, post }: IPostProps) {
  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const router = useRouter();

  function Title() {
    return (
      <div
        className="mt-4 mb-4 text-5xl font-bold break-words hover:cursor-pointer w-fit"
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
      <div className="flex flex-wrap justify-end w-full">
        {Children.toArray(
          post.tags.map((tag, i) => (
            <WrapLink href={`/tag/${tag}`} loader={true}>
              <Btn
                label={`#${tag}`}
                // style={{
                //   margin: "0.125rem",
                //   paddingRight: "0.5rem",
                //   paddingLeft: "0.5rem",
                // }}
              />
            </WrapLink>
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
              <div
                className="w-[calc(100%+32px)] -translate-x-4 pb-[50%]"
                id="post_d1"
              ></div>
            ) : (
              <div className="relative pb-[100%] w-[calc(100%+32px)] -translate-x-4">
                <Image
                  src={post.imgs[0]}
                  alt=""
                  className="object-cover"
                  fill
                />
              </div>
            )}
            {curUser.id === post.uid ? (
              <Profile post={post} user={post.author} info="time" />
            ) : (
              <Profile
                post={post}
                user={post.author}
                info="time"
                action="follow"
              />
            )}
            <Title />
            <Tags />
            <div className="mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
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
