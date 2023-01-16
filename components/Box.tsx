import Image from "next/image";
import Link from "next/link";
import { COLOR, DEFAULT, IPost, IStyle } from "../custom";

interface IBoxProps {
  post: IPost;
  style: IStyle;
}

export default function Box({ post, style }: IBoxProps) {
  return (
    <>
      <div className={`cont cont-${style}`}>
        {post.imgs.length === 0 ? (
          <>
            <div className="bg" />
          </>
        ) : (
          <>
            <img className="bg" src={post.imgs[0]} alt={DEFAULT.img.alt} />
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
          <div className={`title title-${style}`}>{post.title}</div>
        </Link>
        <div className={`tagCont tagCont-${style}`}>
          {(style === "feed" || style === "profile") &&
            [...post.tags]?.reverse().map((tag, i) => (
              <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                <button
                  className={`mainTag mainTag-${style} g-button1`}
                >{`#${tag}`}</button>
              </Link>
            ))}
        </div>
      </div>

      <style jsx>{`
        * {
          color: ${COLOR.txtDark1};
        }
        .mainTag:hover,
        .subTag:hover,
        .title:hover {
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
          background-color: ${post?.color || COLOR.primary};
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
          font-size: 48px;
          font-weight: bold;
          margin: 16px;
          word-break: keep-all;
        }
        .title-feed {
          font-size: 48px;
          margin: 24px;
        }
        .title-search {
          font-size: 16px;
          margin: 8px;
        }
        .title-profile {
          font-size: 24px;
          margin: 12px;
        }
        .tagCont {
          position: absolute;
          text-align: right;
          bottom: 0;
          right: 0;
          margin: 16px;
          display: flex;
          flex-wrap: wrap-reverse;
          flex-direction: row-reverse;
          width: 75%;
        }
        .tagCont-feed {
          margin: 24px;
        }
        .tagCont-profile {
          margin: 12px;
        }
        .mainTagCont {
          text-decoration: none;
        }
        .mainTag {
          margin: 2px 0;
          margin-left: 4px;
          width: fit-content;
          background-color: ${COLOR.btnOverlay};
          color: ${COLOR.txtDark1};
        }
        .mainTag-feed {
          font-size: 24px;
        }
        .mainTag-profile {
          font-size: 12px;
          padding: 4px;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
