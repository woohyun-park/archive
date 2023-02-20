import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Btn from "../../components/atoms/Btn";
import BtnIcon from "../../components/atoms/BtnIcon";
import Page from "../../components/Page";
import Tab from "../../components/Tab";
import { useCachedPage } from "../../hooks/useCachedPage";
import { useCache } from "../../stores/useCache";
import { useStatus } from "../../stores/useStatus";

export default function SearchResult() {
  const router = useRouter();

  const { scroll, setModalLoader } = useStatus();
  const { path, data, isLast, fetchTaggedPosts } = useCachedPage("taggedPosts");

  const keyword = (router.query.keyword as string) || "";

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        fetchTaggedPosts && (await fetchTaggedPosts("init", path, keyword));
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        scrollTo(0, scroll[path]);
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
            onClick: () => router.replace(`/search/posts/${keyword}`),
            style: { width: "100%", marginRight: "0.25rem" },
            isActive: false,
          },
          {
            label: "users",
            onClick: () => router.replace(`/search/users/${keyword}`),
            style: { width: "100%" },
          },
        ]}
      />
      <Page
        page="feed"
        data={data}
        onIntersect={() => {}}
        onChange={() => {}}
        onRefresh={async () => {}}
        changeListener={data}
      />
    </>
  );
}
