import Image from "next/image";
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
          <div className="relative object-cover w-full h-full align-top">
            <Image src={post.imgs[0]} alt="" fill />
          </div>
        ) : type === "color" ? (
          <div
            className="relative object-cover w-full h-full align-top"
            id="d1"
          />
        ) : type === "img-4" ? (
          <div className="relative object-cover w-1/2 align-top h-1/2">
            <Image src={post.imgs[0]} alt="" fill />
          </div>
        ) : type === "color-4" ? (
          <div
            className="relative object-cover w-1/2 align-top h-1/2"
            id="d1"
          />
        ) : (
          <></>
        )}
      </>

      <style jsx>{`
        #d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
