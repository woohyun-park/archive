import React, { createContext, useContext } from "react";

import { COLOR } from "apis/def";
import { IPost } from "types/common";
import { NextRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { useCustomRouter } from "hooks";

type Props = {
  post: IPost;

  children?: React.ReactNode;
  size?: "sm" | "base";
};

type PostBoxContext = { post: IPost; router: NextRouter };
const PostBoxContext = createContext<PostBoxContext | undefined>(undefined);

export default function PostImage({ post, size = "base", children }: Props) {
  const router = useCustomRouter();
  const getClassName = () => {
    return twMerge(
      "absolute overflow-hidden rounded-lg",
      size === "sm" ? "w-36 h-36" : "w-full h-full max-w-[448px] max-h-[448px]"
    );
  };

  return (
    <>
      <PostBoxContext.Provider value={{ post, router }}>
        <div className={getClassName()}>
          {children}
          {post.imgs.length !== 0 && <div className="w-full h-full" id="box_image" />}
          {post.imgs.length === 0 && <div className="w-full h-full" id="box_color" />}
        </div>
      </PostBoxContext.Provider>

      <style jsx>{`
        #box_color {
          background-color: ${post.color};
        }
        #box_image {
          background: linear-gradient(${COLOR.black} -200%, transparent 50%), url(${post.imgs[0]});
          background-size: cover;
        }
      `}</style>
    </>
  );
}

function usePostBox() {
  const context = useContext(PostBoxContext);
  if (context === undefined) {
    throw new Error("usePostBox must be used within a <PostBox />");
  }
  return context;
}

PostImage.Title = function PostImageTitle() {
  const { post, router } = usePostBox();
  const handleClick = () => {
    router.push(`/post/${post.id}`);
  };
  return (
    <div
      className="absolute z-10 m-2 text-xl font-bold leading-5 text-white break-words hover:cursor-pointer"
      onClick={handleClick}
    >
      {post.title}
    </div>
  );
};
