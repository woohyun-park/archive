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
        <div className="cont">
          <div className="bg">
            {posts.length >= 4 ? (
              <>
                <div className="imgCont">
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
          {posts[0].imgs?.length !== 0 && <div className="overlay"></div>}
          <div className={`title title-${style}`} onClick={onClick}>
            {tag === "모든 스크랩" ? tag : `#${tag}`}
          </div>
        </div>
      )}

      <style jsx>{`
        * {
          color: ${COLOR.txtDark1};
        }
        .title:hover {
          cursor: pointer;
        }
        .cont {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          width: calc(33.3% - 8px);
          padding-bottom: calc(33.3% - 8px);
          margin: 4px;
        }
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background-color: ${COLOR.btn1};
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
          margin: 8px;
          word-break: keep-all;
          font-size: 16px;
          background-color: rgba(0, 0, 0, 0.75);
          padding: 4px;
          border-radius: 8px;
        }
        .title-tag {
          word-break: break-all;
        }
        .imgCont {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 100%;
        }
        .img-1 {
          width: 100%;
          height: 100%;
          object-fit: cover;
          vertical-align: top;
        }
        .img-4 {
          width: 50%;
          height: 50%;
          object-fit: cover;
          vertical-align: top;
        }
      `}</style>
    </>
  );
}