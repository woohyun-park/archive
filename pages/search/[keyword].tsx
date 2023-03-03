import { useRouter } from "next/router";
import BtnIcon from "../../components/atoms/BtnIcon";
import PageTab from "../../components/PageTab";

export default function SearchResult() {
  const router = useRouter();

  const keyword = (router.query.keyword as string) || "";

  return (
    <>
      <PageTab
        header={
          <div className="flex p-4 pb-0 bg-white">
            <BtnIcon icon="back" onClick={() => router.back()} />
            <h1 className="title-page-sm">{keyword}에 대한 검색결과</h1>
          </div>
        }
        // 다른 페이지의 tabs와 다르게 search의 tabs는 isPullable을 false로 설정하여 refresh를 할 수 없도록 한다.
        // keyword로 검색을 할때에는 name 또는 title으로 정렬하여 쿼리하기 때문에 새롭게 태그가 추가되더라도 받아오지 못하는 현상이 생길 수 있기 때문이다.
        // e.g. 만약 test라고 검색했을때 결과가 test1, test11이 나왔고, test111이라는 태그가 추가되었다고 하면,
        // 이미 test11이 lastVisible이 되어 lastVisible 이후는 검색하지 않으므로 refresh를 해도 test111을 받아오지 못한다.
        // 따라서 동작하지 않는 refresh를 방지하고자 isPulalble을 false로 설정하며, 재검색시에만 새롭게 추가된 결과들이 나타나게 될 것이다.
        tabs={[
          {
            type: "posts",
            label: "posts",
            query: { type: "keyword", value: { keyword } },
            as: "posts",
            numCols: 1,
            isPullable: false,
          },
          {
            type: "tags",
            label: "tags",
            query: { type: "keyword", value: { keyword } },
            as: "tags",
            isPullable: false,
          },
          {
            type: "users",
            label: "users",
            query: { type: "keyword", value: { keyword } },
            as: "users",
            isPullable: false,
          },
        ]}
      />
    </>
  );
}
