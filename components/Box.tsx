import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { COLOR, getRoute, IPost } from "../libs/custom";

interface IBoxProps {
  post: IPost;
  includeTitle?: boolean;
  includeTag?: boolean;
  style?: string;
}

export default function Box({
  post,
  includeTitle = false,
  includeTag = false,
  style = "",
}: IBoxProps) {
  const router = useRouter();
  const route = getRoute(router);
  return (
    <>
      <div className="pb-[100%] relative overflow-hidden rounded-lg w-full duration-500">
        {post.imgs.length === 0 ? (
          <div className="absolute object-cover w-full h-full" id="box_d1" />
        ) : (
          <>
            <Image
              className="object-cover bg-transparent"
              src={post.imgs[0]}
              alt=""
              fill
            />
            <div className="absolute w-full h-full bg-black/10"></div>
          </>
        )}
        {includeTitle && (
          <Link
            href={{
              pathname: `/post/${post.id}`,
              query: { post: JSON.stringify(post) },
            }}
            as={`/post/${post.id}`}
          >
            <div
              className="absolute m-2 text-5xl font-bold break-words hover:cursor-pointer"
              id="box_d2"
            >
              {post.title}
            </div>
          </Link>
        )}
        {includeTag && (
          <div className="absolute bottom-0 right-0 flex flex-row-reverse flex-wrap-reverse w-2/3 m-4 text-right">
            {route === "feed" &&
              [...post.tags]?.reverse().map((tag, i) => (
                <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                  <button className="m-1 mb-0 button-black hover:cursor-pointer">{`#${tag}`}</button>
                </Link>
              ))}
          </div>
        )}
      </div>
      <style jsx>{`
        * {
          color: ${COLOR.white};
        }
        #box_d1 {
          background-color: ${post.color};
        }
        #box_d2 {
          ${style}
        }
         {
          /* #box_d2-feed {
          margin: 16px;
        }
        #box_d2-profile {
          font-size: 24px;
          margin: 8px 4px;
          line-height: 20px;
        } */
        }
      `}</style>
    </>
  );
}
