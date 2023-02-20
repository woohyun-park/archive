import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import Page from "../../components/Page";
import Tab from "../../components/Tab";
import { useCachedPage } from "../../hooks/useCachedPage";
import { IPost, IUser } from "../../libs/custom";
import { useStatus } from "../../stores/useStatus";

export default function SearchResult() {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const { scroll, setModalLoader } = useStatus();
  const posts = useCachedPage("postsByKeyword");
  const users = useCachedPage("usersByKeyword");

  const keyword = (router.query.keyword as string) || "";
  const path = router.asPath;
  const storage = globalThis?.sessionStorage;
  const prevPath = storage.getItem("currentPath");

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        posts.fetchPostsByKeyword &&
          (await posts.fetchPostsByKeyword("init", path, keyword));
        users.fetchUsersByKeyword &&
          (await users.fetchUsersByKeyword("init", path, keyword));
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        prevPath !== "/search-modal" && scrollTo(0, scroll[path]);
      }
    }
    init();
  }, []);
  return (
    <>
      <div className="flex my-4">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <h1 className="title-page-sm">{keyword}에 대한 검색결과</h1>
      </div>
      <Tab
        tabs={[
          {
            label: "posts",
            onClick: () => setPage(0),
            style: { width: "100%", marginRight: "0.25rem" },
            isActive: page === 0,
          },
          {
            label: "users",
            onClick: () => setPage(1),
            style: { width: "100%" },
            isActive: page === 1,
          },
        ]}
      />
      {page === 0 && (
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
      )}
      {page === 1 && (
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
              users.fetchUsersByKeyword("refresh", path, keyword);
          }}
          changeListener={users.data}
        />
      )}
    </>
  );
}
