import { Children } from "react";
import { IPost } from "../libs/custom";
import Box from "./Box";

interface IPageSearchProps {
  posts: IPost[];
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageSearch({
  posts,
  setLastIntersecting,
}: IPageSearchProps) {
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
                <Box
                  post={{ ...post, id: post.id }}
                  includeTitle={true}
                  includeTag={true}
                  style="font-size: 1rem;"
                ></Box>
              </div>
              {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
            </>
          ))
        )}
      </div>
    </>
  );
}
