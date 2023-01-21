import Image from "next/image";
import Link from "next/link";
import { COLOR, IPost, IStyle } from "../custom";

interface IBoxProps {
  post: IPost;
  style: IStyle;
}

export default function Box({ post, style = "default" }: IBoxProps) {
  return (
    <>
      <div className="relative overflow-hidden rounded-lg w-full pb-[100%]">
        {post.imgs.length === 0 ? (
          <div className="absolute object-cover w-full h-full" id="d1" />
        ) : (
          <>
            <Image className="bg-transparent" src={post.imgs[0]} alt="" fill />
            <div className="absolute w-full h-full bg-black/10"></div>
          </>
        )}
        <Link
          href={{
            pathname: `/post/${post.id}`,
            query: { post: JSON.stringify(post) },
          }}
          as={`/post/${post.id}`}
        >
          <div
            className="absolute m-2 text-5xl font-bold break-words hover:cursor-pointer"
            id={`d2-${style}`}
          >
            {post.title}
          </div>
        </Link>
        <div className="absolute bottom-0 right-0 flex flex-row-reverse flex-wrap-reverse w-2/3 text-right ">
          {style === "feed" &&
            [...post.tags]?.reverse().map((tag, i) => (
              <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                <button className="g-b1 hover:cursor-pointer">{`#${tag}`}</button>
              </Link>
            ))}
        </div>
      </div>
      <style jsx>{`
        * {
          color: ${COLOR.txtDark1};
        }
        #d1 {
          background-color: ${post.color};
        }
        #d2-search {
          font-size: 16px;
          margin: 16px;
        }
        #d2-profile {
          font-size: 24px;
          margin: 8px;
          line-height: 20px;
        }
      `}</style>
    </>
  );
}
