import Link from "next/link";
import { useState } from "react";
import { COLOR, IPost, IStyle } from "../custom";
import useDict from "../hooks/useDict";

interface IImageProps {
  post: IPost;
  style: IStyle;
}

export default function Image({ post, style }: IImageProps) {
  const [tags, setTags] = useDict(post.tags);
  return (
    <>
      <div className={`cont cont-${style}`}>
        {post.imgs.length === 0 ? (
          <div className="bg" />
        ) : (
          <>
            <img className="bg" src={post.imgs[0]} />
            <div className="overlay"></div>
          </>
        )}
        <Link
          href={{
            pathname: `/post/${post.id}`,
            query: { post: JSON.stringify(post) },
          }}
          as={`/post/${post.id}`}
        >
          <div className="title">{post.title}</div>
        </Link>
        <div className="tagCont">
          {(style === "feed" || style === "profile") &&
            tags.map((tag, i) => (
              <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                <div className="mainTag">{`#${tag}`}</div>
              </Link>
            ))}
        </div>
      </div>

      <style jsx>{`
        * {
          color: ${COLOR.txtDark1};
        }
        .mainTag:hover,
        .subTag:hover {
          cursor: pointer;
        }
        .cont {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        .cont-feed {
          width: 100%;
          padding-bottom: 100%;
        }
        .cont-search {
          width: calc(33.33% - 8px);
          padding-bottom: calc(33.33% - 8px);
          margin: 4px;
        }
        .cont-profile {
          width: calc(50% - 8px);
          padding-bottom: calc(50% - 8px);
          margin: 4px;
        }
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: ${post.color};
        }
        .overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.1);
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
        .mainTagCont {
          text-decoration: none;
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
