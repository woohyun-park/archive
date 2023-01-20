import Image from "next/image";
import Link from "next/link";
import { COLOR, IPost, IStyle } from "../custom";

interface IBoxProps {
  post: IPost;
  style: IStyle;
}

export default function Box({ post, style }: IBoxProps) {
  return (
    <>
      <div className="relative overflow-hidden rounded-lg w-full pb-[100%]">
        {post.imgs.length === 0 ? (
          <div className="d1 absolute w-full h-full object-cover" />
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
            className={`d2-${style} absolute text-5xl font-bold m-4 break-words hover:cursor-pointer`}
          >
            {post.title}
          </div>
        </Link>
        <div
          className={`absolute bottom-0 right-0 text-right flex flex-wrap-reverse flex-row-reverse w-2/3 tagCont-${style}`}
        >
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
        .d1 {
          background-color: ${post?.color || COLOR.primary};
        }
        .d2-search {
          font-size: 16px;
          margin: 8px;
        }
        .d2-profile {
          font-size: 24px;
          line-height: 20px;
          margin: 8px;
        }
      `}</style>
    </>
  );
}
