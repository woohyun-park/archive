import { COLOR, IPost, IStyle } from "../custom";
import ContImage from "./ContImage";

interface IImageProps {
  tag: string;
  posts: IPost[];
  style?: IStyle;
  onClick?: () => void;
}

export default function Cont({ tag, posts, style, onClick }: IImageProps) {
  return (
    <>
      {posts.length !== 0 && (
        <div className="text-white relative overflow-hidden rounded-lg w-full pb-[100%]">
          <div className="absolute w-full h-full obejct-cover">
            {posts.length >= 4 ? (
              <>
                <div className="flex flex-wrap w-full h-full">
                  {[...posts].slice(0, 4).map((e, i) => {
                    if (e.imgs.length === 0) {
                      return <ContImage post={e} type="color-4" key={e.id} />;
                    } else {
                      return <ContImage post={e} type="img-4" key={e.id} />;
                    }
                  })}
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
            id={`d1-${style}`}
            onClick={onClick}
          >
            {tag === "모든 스크랩" ? tag : `#${tag}`}
          </div>
        </div>
      )}

      <style jsx>{`
        #d1-tag {
          word-break: break-all;
        }
      `}</style>
    </>
  );
}
