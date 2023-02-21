import { useRouter } from "next/router";
import { Children, CSSProperties, MouseEventHandler, useState } from "react";
import { useCachedPage } from "../hooks/useCachedPage";
import { IPost, IUser } from "../libs/custom";
import Btn from "./atoms/Btn";
import Page from "./Page";

interface ITabSearchProps {
  tabs: ITabSearch[];
}

interface ITabSearch {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  isActive?: boolean;
}

export default function TabSearch({ tabs }: ITabSearchProps) {
  const [page, setPage] = useState(0);
  const router = useRouter();

  const posts = useCachedPage("postsByKeyword");
  const users = useCachedPage("usersByKeyword");

  const path = router.asPath;
  const keyword = (router.query.keyword as string) || "";

  return (
    <>
      <div className="flex h-full m-4">
        <Btn
          label="posts"
          onClick={() => setPage(0)}
          style={{ width: "100%", marginRight: "0.25rem" }}
          isActive={page === 0}
        />
        <Btn
          label="tags"
          onClick={() => setPage(1)}
          style={{ width: "100%", marginRight: "0.25rem" }}
          isActive={page === 1}
        />
        <Btn
          label="users"
          onClick={() => setPage(2)}
          style={{ width: "100%" }}
          isActive={page === 2}
        />
      </div>
      <div className="h-[calc(100vh_-_15rem)] mb-[5.75rem] overflow-scroll relative">
        <div
          className={
            page === 0
              ? "w-full absolute -translate-x-[0] duration-300"
              : page === 1
              ? "w-full absolute -translate-x-[100%] duration-300"
              : "w-full absolute -translate-x-[200%] duration-300"
          }
        >
          <Page
            page="feed"
            data={posts.data as IPost[]}
            onIntersect={() => {
              posts.fetchPostsByKeyword &&
                posts.fetchPostsByKeyword("load", path, keyword);
            }}
            onChange={() => {}}
            onRefresh={async () => {
              posts.fetchPostsByKeyword &&
                (await posts.fetchPostsByKeyword("refresh", path, keyword));
            }}
            changeListener={posts.data}
          />
        </div>
        <div
          className={
            page === 0
              ? "w-full absolute translate-x-[200%] duration-300"
              : page === 1
              ? "w-full absolute translate-x-[100%] duration-300"
              : "w-full absolute -translate-x-[0] duration-300"
          }
        >
          <Page
            page="user"
            data={users.data as IUser[]}
            onIntersect={() => {
              users.fetchUsersByKeyword &&
                users.fetchUsersByKeyword("load", path, keyword);
            }}
            onChange={() => {}}
            onRefresh={async () => {
              users.fetchUsersByKeyword &&
                (await users.fetchUsersByKeyword("refresh", path, keyword));
            }}
            changeListener={users.data}
          />
        </div>
      </div>
    </>
  );
}
