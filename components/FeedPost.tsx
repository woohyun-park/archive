import Link from "next/link";
import { useRouter } from "next/router";
import { getRoute, IPost } from "../libs/custom";
import Box from "../components/Box";
import WrapScroll from "../components/wrappers/WrapScroll";
import Action from "../components/Action";
import ProfileSmall from "../components/ProfileSmall";
import { IUser } from "../libs/custom";
import { useUser } from "../stores/useUser";
import { Children } from "react";
import { useModal } from "../stores/useModal";
import WrapMotion from "./wrappers/WrapMotion";
import PostTitle from "./atoms/PostTitle";

interface IFeedPostProps {
  post: IPost;
}

export default function FeedPost({ post }: IFeedPostProps) {
  const router = useRouter();
  const route = getRoute(router);
  const { curUser } = useUser();
  const { setModalLoader } = useModal();
  return (
    <>
      <WrapMotion type="float" className="px-4 py-1 bg-white">
        <WrapScroll>
          <ProfileSmall post={post} user={post.author as IUser} type="post" />
          <Box post={post} />
          <PostTitle post={post} />
          <div className="bottom-0 right-0 flex flex-row-reverse flex-wrap-reverse text-left ">
            {route === "feed" &&
              Children.toArray(
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
  );
}
