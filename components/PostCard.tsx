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

interface IPostCardProps {
  post: IPost;
}

export default function PostCard({ post }: IPostCardProps) {
  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const router = useRouter();
  return (
    <>
      <WrapMotion type="float" className="px-4 py-1 bg-white">
        <Profile
          post={post}
          user={post.author as IUser}
          info="time"
          action={curUser.id === post.uid ? "modifyAndDelete" : undefined}
        />
        <PostBox post={post} type="noText" />
        <div
          className="mt-4 mb-4 text-5xl font-bold break-words hover:cursor-pointer w-fit"
          onClick={() => {
            router.asPath !== `/post/${post.id}` && setModalLoader(true);
            router.push(`/post/${post.id}`);
          }}
        >
          {post.title}
        </div>
        <div className="flex flex-wrap justify-end w-full">
          {Children.toArray(
            post.tags.map((tag, i) => (
              <WrapLink href={`/tag/${tag}`} loader={true}>
                <Btn label={`#${tag}`} className="px-2" />
              </WrapLink>
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
      </WrapMotion>

      <style jsx>{`
        #post_d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
