import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Page from "../../components/Page";
import { IPost } from "../../libs/custom";
import { useCache } from "../../stores/useCache";
import { useStatus } from "../../stores/useStatus";

export default function SearchResult() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  const { scroll, setModalLoader } = useStatus();
  const { caches, fetchTagPage } = useCache();

  const keyword = (router.query.keyword as string) || "";
  const path = router.asPath;
  const cache = caches[path];

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        await fetchTagPage("init", path, keyword);
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
      <h1>{keyword}</h1>
      <Page
        page="feed"
        data={cache.data as IPost[]}
        onIntersect={() => {}}
        onChange={() => {}}
        onRefresh={async () => {}}
        changeListener={cache.data}
      />
    </>
  );
}
