import { useRouter } from "next/router";
import BtnIcon from "../../components/atoms/BtnIcon";
import PagePosts from "../../components/PagePosts";
import PageTab from "../../components/PageTab";
import { useUser } from "../../stores/useUser";

export default function Scrap() {
  const router = useRouter();

  const { curUser } = useUser();

  const uid = curUser.id;
  const cont = router.query.cont as string;

  return (
    <PagePosts
      query={{ type: "uidAndScrap", value: { uid, cont } }}
      as="posts"
      numCols={1}
    />
  );
}
