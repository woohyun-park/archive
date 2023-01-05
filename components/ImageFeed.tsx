import Link from "next/link";
import { IPost } from "../custom";

type IImageFeedProps = {
  post: IPost;
  size: string;
};

export default function ImageFeed({ post, size }: IImageFeedProps) {
  return (
    <>
      <div className="cont">
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
          <Link href={{ pathname: `/tag/${post.tags[0]}` }} legacyBehavior>
            <a className="mainTagCont">
              <div className="mainTag">{`#${post.tags[0]}`}</div>
            </a>
          </Link>
          <div>
            {post.tags.slice(1, post.tags.length).map((e, i) => (
              <Link
                href={{ pathname: `/tag/${post.tags[i + 1]}` }}
                legacyBehavior
              >
                <span className="subTag" key={i}>{` #${e}`}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          color: white;
        }
        .mainTag:hover,
        .subTag:hover {
          cursor: pointer;
        }
        .cont {
          position: relative;
          width: ${size === "small" ? "calc(50% - 8px)" : "100%"};
          padding-bottom: ${size === "small" ? "calc(50% - 8px)" : "100%"};
          overflow: hidden;
          border-radius: 16px;
          margin: ${size === "small" ? "4px" : ""};
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
