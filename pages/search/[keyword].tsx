import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import Page from "../../components/Page";
import Tab from "../../components/Tab";
import { useCachedPage } from "../../hooks/useCachedPage";
import { useStatus } from "../../stores/useStatus";

export default function SearchResult() {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const { scroll, setModalLoader } = useStatus();
  const posts = useCachedPage("taggedPosts");

  const keyword = (router.query.keyword as string) || "";
  const path = router.asPath;
  const storage = globalThis?.sessionStorage;
  const prevPath = storage.getItem("currentPath");

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        posts.fetchTaggedPosts &&
          (await posts.fetchTaggedPosts("init", path, keyword));
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
      <div className="flex m-4">
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
          data={posts.data}
          onIntersect={() => {
            posts.fetchTaggedPosts &&
              posts.fetchTaggedPosts("load", path, keyword);
          }}
          onChange={() => {}}
          onRefresh={async () => {
            posts.fetchTaggedPosts &&
              (await posts.fetchTaggedPosts("refresh", path, keyword));
          }}
          changeListener={posts.data}
        />
      )}
    </>
  );
}
