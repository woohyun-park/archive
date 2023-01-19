import Image from "next/image";
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
          <div className="img-1">
            <Image src={post.imgs[0]} alt="" fill />
          </div>
        ) : type === "color" ? (
          <div className="img-1" />
        ) : type === "img-4" ? (
          <div className="img-4">
            <Image src={post.imgs[0]} alt="" fill />
          </div>
        ) : type === "color-4" ? (
          <div className="img-4" />
        ) : (
          <></>
        )}
      </>

      <style jsx>{`
        .img-1 {
          position: relative;
          width: 100%;
          height: 100%;
          object-fit: cover;
          vertical-align: top;
          background-color: ${post.color || COLOR.btn1};
        }
        .img-4 {
          position: relative;
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
