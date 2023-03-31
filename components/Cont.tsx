import { useRouter } from "next/router";
import { Children } from "react";
import { IPost } from "../apis/def";
import ContImage from "./ContImage";

interface IImageProps {
  tag: string;
  posts: IPost[];
  type: "color" | "img" | "color-4" | "img-4";
  onClick?: () => void;
}

export default function Cont({ tag, posts, type, onClick }: IImageProps) {
  const router = useRouter();
  return (
    <>
      {posts.length !== 0 && (
        <div className="text-white relative overflow-hidden rounded-lg w-full pb-[100%]">
          <div className="absolute w-full h-full obejct-cover">
            {posts.length >= 4 ? (
              <>
                <div className="flex flex-wrap w-full h-full">
                  {Children.toArray(
                    [...posts]
                      .slice(0, 4)
                      .map((e) =>
                        e.imgs.length === 0 ? (
                          <ContImage post={e} type="color-4" />
                        ) : (
                          <ContImage post={e} type="img-4" />
                        )
                      )
                  )}
                </div>
              </>
            ) : posts[0].imgs?.length === 0 ? (
              <ContImage post={posts[0]} type="color" />
            ) : (
              <ContImage post={posts[0]} type="img" />
            )}
          </div>
          {posts[0].imgs?.length !== 0 && (
            <div className="absolute w-full h-full bg-black/10"></div>
          )}
          <div
            className="absolute p-1 m-2 text-base font-bold rounded-lg break-keep bg-black/75 hover:cursor-pointer"
            id={`cont_d1-${type}`}
            onClick={onClick}
          >
            {tag === "모든 스크랩" ? tag : `#${tag}`}
          </div>
        </div>
      )}

      <style jsx>{`
        #cont_d1-tag {
          word-break: break-all;
        }
      `}</style>
    </>
  );
}
