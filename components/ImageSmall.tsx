import { Post } from "../types";

type IImageSmallProps = {
  post: Post;
};

export default function ImageSmall({ post }: IImageSmallProps) {
  return (
    <>
      <div className="cont">
        <div className="imgCont">
          <img className="img" src={post.imgs[0]} />
          <div className="overlay"></div>
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
      </div>

      <style jsx>{`
        .cont {
          position: absolute;
          width: calc(100% - 36px);
          color: white;
        }
        .imgCont {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          overflow: hidden;
          border-radius: 16px;
        }
        .img {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(50, 50);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
        }
        .title {
          position: absolute;
          top: 16px;
          left: 16px;
          font-size: 32px;
          font-weight: bold;
        }
        .tagCont {
          position: absolute;
          text-align: right;
          bottom: 16px;
          right: 16px;
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
