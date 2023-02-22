import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import PageTab from "../../components/PageTab";
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
      <PageTab
        header={
          <div className="flex p-4 pb-0 bg-white">
            <BtnIcon icon="back" onClick={() => router.back()} />
            <h1 className="title-page-sm">{keyword}에 대한 검색결과</h1>
          </div>
        }
        tabs={[
          {
            type: "posts",
            fetchType: "postsByKeyword",
            label: "posts",
            numCol: 1,
          },
          // {
          //   label: "tags",
          //   data: tags.data as ITag[],
          //   page: "tag",
          //   onIntersect: () => {
          //     tags.fetchTags && tags.fetchTags("load", path, keyword);
          //   },
          //   onChange: () => {},
          //   onRefresh: async () => {
          //     tags.fetchTags &&
          //       (await tags.fetchTags("refresh", path, keyword));
          //   },
          //   changeListener: tags.data,
          // },
          {
            type: "users",
            fetchType: "usersByKeyword",
            label: "users",
          },
        ]}
      />
    </>
  );
}
