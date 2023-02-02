import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { COLOR, getRoute, IPost } from "../libs/custom";
import { useEffect, useState } from "react";
import { useStore } from "../stores/useStore";
import Box from "../components/Box";
import WrapScroll from "../components/wrappers/WrapScroll";
import Loader from "../components/Loader";
import Action from "../components/Action";
import ProfileSmall from "../components/ProfileSmall";
import { IUser } from "../libs/custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import IconBtn from "../components/atoms/IconBtn";
import { useFeed } from "../stores/useFeed";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { floatVariants } from "../libs/motionLib";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";

interface IFeedPostProps {
  post: IPost;
}

export default function FeedPost({ post }: IFeedPostProps) {
  const router = useRouter();
  const route = getRoute(router);
  const { curUser } = useUser();
  return (
    <>
      <motion.div
        key={post.id || ""}
        initial="initial"
        animate="animate"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={floatVariants}
        className="px-4 py-1 bg-white "
      >
        <WrapScroll key={post.id}>
          <ProfileSmall post={post} user={post.author as IUser} type="post" />
          <Box post={post} />

          <Link
            href={{
              pathname: `/post/${post.id}`,
              query: { post: JSON.stringify(post) },
            }}
            as={`/post/${post.id}`}
          >
            <div
              className="mt-4 mb-4 text-5xl font-bold break-words hover:cursor-pointer"
              id={`box_d2-${route}`}
            >
              {post.title}
            </div>
          </Link>
          <div className="bottom-0 right-0 flex flex-row-reverse flex-wrap-reverse text-left ">
            {route === "feed" &&
              [...post.tags]?.reverse().map((tag, i) => (
                <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                  <button className="m-1 mb-0 button-black hover:cursor-pointer">{`#${tag}`}</button>
                </Link>
              ))}
          </div>
          <Action
            post={post}
            curUser={curUser}
            onCommentClick={() =>
              router.push(
                {
                  pathname: `/post/${post.id}`,
                  query: { isCommentFocused: true },
                },
                `/post/${post.id}`
              )
            }
          />
        </WrapScroll>
      </motion.div>
    </>
  );
}
