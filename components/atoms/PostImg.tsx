import Image from "next/image";

interface IPostImgProps {
  imgs: string[];
  color: string;
}

export default function PostImg({ imgs, color }: IPostImgProps) {
  return (
    <>
      {imgs.length === 0 ? (
        <div
          className="w-[calc(100%+32px)] -translate-x-4 pb-[50%]"
          id="postImg_d1"
        ></div>
      ) : (
        <div className="relative pb-[100%] w-[calc(100%+32px)] -translate-x-4">
          <Image src={imgs[0]} alt="" className="object-cover" fill />
        </div>
      )}
      <style jsx>{`
        #postImg_d1 {
          background-color: ${color};
        }
      `}</style>
    </>
  );
}
