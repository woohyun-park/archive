import { Children } from "react";
import { IPost } from "../libs/custom";
import PostBox from "./PostBox";

interface IPageSearchProps {
  posts: IPost[];
  isLast: boolean;
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageSearch({
  posts,
  isLast,
  setLastIntersecting,
}: IPageSearchProps) {
  console.log("pageSearch!!!", isLast);
  return (
    <>
      <div
        className={
          posts.length !== 0 ? "grid grid-cols-3 mt-4 mb-4 gap-y-2 gap-x-2" : ""
        }
      >
        {Children.toArray(
          posts.map((post, i) => (
            <>
              <div>
                <PostBox type="title" post={{ ...post, id: post.id }} />
              </div>
              {!isLast && i === posts.length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
            </>
          ))
        )}
      </div>
    </>
  );
}
