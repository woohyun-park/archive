import { useRouter } from "next/router";
import BtnIcon from "../../../../components/atoms/BtnIcon";
import PagePosts from "../../../../components/PagePosts";
import { useUser } from "../../../../stores/useUser";

export default function Scrap() {
  const router = useRouter();

  const { curUser } = useUser();

  const uid = curUser.id;
  const cont = router.query.cont as string;

  return (
    <>
      <div className="flex items-center justify-center mt-2">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-sm">{cont}</div>
      </div>
      <div className="top-0 m-auto text-xs text-center text-gray-2f">
        {curUser?.displayName}
      </div>
      <PagePosts
        query={{ type: "uidAndScrap", value: { uid, cont } }}
        as="posts"
        numCols={1}
      />
    </>
  );
}
