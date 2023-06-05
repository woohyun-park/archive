import { IPost, IUser } from "types/common";

import { AUTH_USER_DEFAULT } from "consts/auth";
import Action from "components/Action";
import PostBox from "components/molecules/PostImage/PostImage";
import Profile from "components/Profile";
import Tags from "components/Tags";
import { WrapMotionFloat } from "components/wrappers/motion";
import { useCustomRouter } from "hooks";
import { useStatus } from "stores/useStatus";
import { useUser } from "providers";

interface IPostCardProps {
  post: IPost;
}

export default function PostCard({ post }: IPostCardProps) {
  const userContext = useUser();
  const curUser = userContext.data || AUTH_USER_DEFAULT;

  const { setModalLoader } = useStatus();

  const router = useCustomRouter();
  return (
    <>
      <WrapMotionFloat className="px-4 py-1 bg-white">
        <Profile
          post={post}
          user={post.author as IUser}
          info="time"
          action={curUser.id === post.uid ? "modifyAndDelete" : undefined}
        />
        <PostBox post={post} type="noText" />
        <div
          className="mt-4 mb-4 text-5xl font-bold leading-[3rem] break-words hover:cursor-pointer w-fit"
          onClick={() => {
            router.asPath !== `/post/${post.id}` && setModalLoader(true);
            router.push(`/post/${post.id}`);
          }}
        >
          {post.title}
        </div>
        <Tags tags={post.tags} />
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
      </WrapMotionFloat>

      <style jsx>{`
        #post_d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
