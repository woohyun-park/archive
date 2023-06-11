import React, { createContext, useContext } from "react";

import { COLOR } from "apis/def";
import { useCustomRouter } from "hooks";
import { NextRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { IPost } from "types/common";

type Props = {
  post: IPost;

  children?: React.ReactNode;
  size?: "sm" | "base";
};

type PostImageContext = { post: IPost; router: NextRouter };
const PostImageContext = createContext<PostImageContext | undefined>(undefined);

export default function PostImage({ post, size = "base", children }: Props) {
  const router = useCustomRouter();
  const getClassName = () => {
    return twMerge(
      "overflow-hidden rounded-lg",
      size === "sm" ? "w-36 h-36" : "w-[36rem] h-[36rem] max-w-[448px] max-h-[448px]"
    );
  };

  return (
    <>
      <PostImageContext.Provider value={{ post, router }}>
        <div className={getClassName()}>
          {children}
          {post.imgs.length !== 0 && <div className="w-full h-full" id="box_image" />}
          {post.imgs.length === 0 && <div className="w-full h-full" id="box_color" />}
        </div>
      </PostImageContext.Provider>

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

function usePostImage() {
  const context = useContext(PostImageContext);
  if (context === undefined) {
    throw new Error("usePostImage must be used within a <PostImage />");
  }
  return context;
}

PostImage.Title = function PostImageTitle() {
  const { post, router } = usePostImage();
  const handleClick = () => {
    router.push(`/post/${post.id}`);
  };
  return (
    <div
      className="w-[calc(144px_-_1rem)] absolute z-10 m-2 text-xl font-bold leading-5 text-white break-words hover:cursor-pointer"
      onClick={handleClick}
    >
      {post.title}
    </div>
  );
};
