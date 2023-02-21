import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import TabPage from "../../components/TabPage";
import { useCachedPage } from "../../hooks/useCachedPage";
import { IPost, ITag, IUser } from "../../libs/custom";
import { useStatus } from "../../stores/useStatus";

export default function SearchResult() {
  const router = useRouter();

  const { setModalLoader } = useStatus();
  const posts = useCachedPage("postsByKeyword");
  const users = useCachedPage("usersByKeyword");
  const tags = useCachedPage("tags");

  const keyword = (router.query.keyword as string) || "";
  const path = router.asPath;

  useEffect(() => {
    async function init() {
      if (posts.data.length === 0 && users.data.length == 0) {
        posts.fetchPostsByKeyword &&
          (await posts.fetchPostsByKeyword("init", path, keyword));
        users.fetchUsersByKeyword &&
          (await users.fetchUsersByKeyword("init", path, keyword));
        tags.fetchTags && (await tags.fetchTags("init", path, keyword));
        setModalLoader(false);
      }
    }
    init();
  }, []);
  return (
    <>
      <div className="flex m-4 mb-8">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <h1 className="title-page-sm">{keyword}에 대한 검색결과</h1>
      </div>
      <TabPage
        tabs={[
          {
            label: "posts",
            data: posts.data as IPost[],
            page: "feed",
            onIntersect: () => {
              posts.fetchPostsByKeyword &&
                posts.fetchPostsByKeyword("load", path, keyword);
            },
            onChange: () => {},
            onRefresh: async () => {
              posts.fetchPostsByKeyword &&
                (await posts.fetchPostsByKeyword("refresh", path, keyword));
            },
            changeListener: posts.data,
          },
          {
            label: "tags",
            data: tags.data as ITag[],
            page: "tag",
            onIntersect: () => {
              tags.fetchTags && tags.fetchTags("load", path, keyword);
            },
            onChange: () => {},
            onRefresh: async () => {
              tags.fetchTags &&
                (await tags.fetchTags("refresh", path, keyword));
            },
            changeListener: tags.data,
          },
          {
            label: "users",
            data: users.data as IUser[],
            page: "user",
            onIntersect: () => {
              users.fetchUsersByKeyword &&
                users.fetchUsersByKeyword("load", path, keyword);
            },
            onChange: () => {},
            onRefresh: async () => {
              users.fetchUsersByKeyword &&
                (await users.fetchUsersByKeyword("refresh", path, keyword));
            },
            changeListener: users.data,
          },
        ]}
      />
    </>
  );
}
