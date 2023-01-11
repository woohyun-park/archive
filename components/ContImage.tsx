import Link from "next/link";
import { COLOR, IPost } from "../custom";

interface IContImageProps {
  post: IPost;
  type: string;
}

export default function ContImage({ post, type }: IContImageProps) {
  return (
    <>
      <>
        {type === "img" ? (
          <img className="img-1" src={post.imgs[0]} />
        ) : type === "color" ? (
          <img className="img-1" />
        ) : type === "img-4" ? (
          <img className="img-4" src={post.imgs[0]}></img>
        ) : type === "color-4" ? (
          <img className="img-4"></img>
        ) : (
          <></>
        )}
      </>

      <style jsx>{`
        .img-1 {
          width: 100%;
          height: 100%;
          object-fit: cover;
          vertical-align: top;
          background-color: ${post.color || COLOR.btn1};
        }
        .img-4 {
          width: 50%;
          height: 50%;
          object-fit: cover;
          vertical-align: top;
          background-color: ${post.color || COLOR.btn1};
        }
      `}</style>
    </>
  );
}
