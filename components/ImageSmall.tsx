import Link from "next/link";
import { IPost } from "../types";

type IImageSmallProps = {
  post: IPost;
};

export default function ImageSmall({ post }: IImageSmallProps) {
  return (
    <>
      <Link href={`/post/${post.id}`}>
        <div className="cont">
          {post.imgs.length === 0 ? (
            <div className="bg" />
          ) : (
            <>
              <img className="bg" src={post.imgs[0]} />
              <div className="overlay"></div>
            </>
          )}
          <div className="title">{post.title}</div>
          <div className="tagCont">
            <div className="mainTag">{post.tags[0]}</div>
            <div>
              {post.tags.slice(1, post.tags.length).map((e) => (
                <span className="subTag">{` #${e}`}</span>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
        * {
          color: white;
        }
        .cont {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          overflow: hidden;
          border-radius: 16px;
        }
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(50, 50);
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: ${post.color};
        }
        .overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
        }
        .title {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 32px;
          font-weight: bold;
          margin: 16px;
          word-break: keep-all;
        }
        .tagCont {
          position: absolute;
          text-align: right;
          bottom: 0;
          right: 0;
          margin: 16px;
        }
        .mainTag {
          font-size: 24px;
          font-weight: bold;
        }
        .subTag {
          font-size: 16px;
        }
      `}</style>
    </>
  );
}
