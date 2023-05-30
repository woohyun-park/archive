import { useCustomRouter, useInfiniteScroll, useScrollBack } from "hooks";

import { AUTH_USER_DEFAULT } from "consts/auth";
import BtnIcon from "components/atoms/BtnIcon";
import { InfinitePosts } from "components/common";
import { ModalSpinner } from "components/templates";
import useFirebaseQuery from "hooks/useFirebaseQuery";
import { useUser } from "providers";

export default function Scrap() {
  const router = useCustomRouter();
  const userContext = useUser();
  const { uid, cont } = router.query;
  const infiniteScroll = useInfiniteScroll({
    queryKey: [`profile/${uid}/scraps/${cont}`],
    ...useFirebaseQuery("profile/scraps/detail"),
  });
  const curUser = userContext.data || AUTH_USER_DEFAULT;

  useScrollBack();

  if (infiniteScroll.isLoading) return <ModalSpinner />;

  return (
    <>
      <div className="flex items-center justify-center mt-2">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-sm">{cont}</div>
      </div>
      <div className="top-0 m-auto text-xs text-center text-gray-2f">
        {curUser.displayName}
      </div>
      <InfinitePosts numCols={1} infiniteScroll={infiniteScroll} />
    </>
  );
}
