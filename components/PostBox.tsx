import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
import { Children } from "react";
import useCustomRouter from "../hooks/useCustomRouter";
import { IPost } from "../apis/interface";
import { COLOR } from "../apis/setting";

type IPostBoxType = "noText" | "title" | "titleAndTags";

interface IPostBoxProps {
  type: IPostBoxType;
  post: IPost;
}

export default function PostBox({ type, post }: IPostBoxProps) {
  const router = useCustomRouter();
  return (
    <>
      <div className="pb-[100%] relative overflow-hidden rounded-lg w-full duration-500">
        {post.imgs.length === 0 ? (
          <div className="absolute object-cover w-full h-full" id="box_d1" />
        ) : (
          <>
            <Image
              className="object-cover bg-transparent"
              src={post.imgs[0]}
              alt=""
              fill
            />
            <div className="absolute w-full h-full bg-black/10"></div>
          </>
        )}
        {(type === "title" || type === "titleAndTags") && (
          <div
            className={
              type === "title"
                ? "absolute m-2 text-xl font-bold break-words hover:cursor-pointer leading-5"
                : "absolute m-2 text-2xl font-bold leading-6 break-words hover:cursor-pointer"
            }
            onClick={() =>
              router.push(
                {
                  pathname: `/post/${post.id}`,
                  query: { post: JSON.stringify(post) },
                },
                `/post/${post.id}`
              )
            }
          >
            {post.title}
          </div>
        )}
        {type === "titleAndTags" && (
          <div className="absolute bottom-0 right-0 flex flex-row-reverse flex-wrap-reverse w-[2/3] mx-2 my-3 text-right">
            {Children.toArray(
              [...post.tags]
                ?.reverse()
                .map((tag) => (
                  <button
                    className="tag-sm my-1 mx-[0.125rem] mb-0"
                    onClick={() => router.push(`/tag/${tag}`)}
                  >{`#${tag}`}</button>
                ))
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        * {
          color: ${COLOR.white};
        }
        #box_d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
