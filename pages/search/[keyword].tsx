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
        tabs={[
          {
            label: "posts",
            type: "posts",
            query: { type: "keyword", value: { keyword } },
            as: "posts",
            numCols: 1,
          },
          {
            type: "tags",
            fetchType: "tags",
            label: "tags",
          },
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
