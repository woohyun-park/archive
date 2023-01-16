import Link from "next/link";
import { COLOR, DEFAULT, IPost } from "../custom";

interface IContImageProps {
  post: IPost;
  type: string;
}

export default function ContImage({ post, type }: IContImageProps) {
  return (
    <>
      <>
        {type === "img" ? (
          <img className="img-1" src={post.imgs[0]} alt={DEFAULT.img.alt} />
        ) : type === "color" ? (
          <div className="img-1" />
        ) : type === "img-4" ? (
          <img className="img-4" src={post.imgs[0]} alt={DEFAULT.img.alt}></img>
        ) : type === "color-4" ? (
          <div className="img-4" />
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
