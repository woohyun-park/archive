import Image from "next/image";
import { IPost } from "../libs/custom";

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
            id="contImage_d1"
          />
        ) : type === "img-4" ? (
          <div className="relative object-cover w-1/2 align-top h-1/2">
            <Image src={post.imgs[0]} alt="" fill />
          </div>
        ) : type === "color-4" ? (
          <div
            className="relative object-cover w-1/2 align-top h-1/2"
            id="contImage_d1"
          />
        ) : (
          <></>
        )}
      </>

      <style jsx>{`
        #contImage_d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
