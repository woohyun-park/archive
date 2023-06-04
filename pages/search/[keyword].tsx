import { InfinitePosts, InfiniteTags, InfiniteUsers, PageTab } from "components/common";
import { useFirebaseQuery, useInfiniteScroll, useScrollBack } from "hooks";

import { Icon } from "components/atoms";
import { useRouter } from "next/router";

export default function SearchResult() {
  const router = useRouter();
  const { keyword } = router.query;

  const infinitePosts = useInfiniteScroll({
    queryKey: [`search/${keyword}/posts`],
    ...useFirebaseQuery("search/keyword/posts"),
  });
  const infiniteTags = useInfiniteScroll({
    queryKey: [`search/${keyword}/tags`],
    ...useFirebaseQuery("search/keyword/tags"),
  });
  const infiniteUsers = useInfiniteScroll({
    queryKey: [`search/${keyword}/users`],
    ...useFirebaseQuery("search/keyword/users"),
  });

  useScrollBack();

  return (
    <>
      <PageTab
        header={
          <div className="flex p-4 pb-0 bg-white">
            <Icon icon="back" onClick={() => router.back()} />
            <h1 className="title-page-sm">{keyword}에 대한 검색 결과</h1>
          </div>
        }
        // 다른 페이지의 tabs와 다르게 search의 tabs는 isPullable을 false로 설정하여 refresh를 할 수 없도록 한다.
        // keyword로 검색을 할때에는 name 또는 title으로 정렬하여 쿼리하기 때문에 새롭게 태그가 추가되더라도 받아오지 못하는 현상이 생길 수 있기 때문이다.
        // e.g. 만약 test라고 검색했을때 결과가 test1, test11이 나왔고, test111이라는 태그가 추가되었다고 하면,
        // 이미 test11이 lastVisible이 되어 lastVisible 이후는 검색하지 않으므로 refresh를 해도 test111을 받아오지 못한다.
        // 따라서 동작하지 않는 refresh를 방지하고자 isPulalble을 false로 설정하며, 재검색시에만 새롭게 추가된 결과들이 나타나게 될 것이다.
        tabs={[
          {
            label: "posts",
            children: (
              <InfinitePosts numCols={1} infiniteScroll={infinitePosts} isPullable={false} />
            ),
          },
          {
            label: "tags",
            children: <InfiniteTags infiniteScroll={infiniteTags} isPullable={false} />,
          },
          {
            label: "users",
            children: <InfiniteUsers infiniteScroll={infiniteUsers} isPullable={false} />,
          },
        ]}
      />
    </>
  );
}
