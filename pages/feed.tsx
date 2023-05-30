import { InfinitePosts, Message } from "components/common";
import { useInfiniteScroll, useScrollBack } from "hooks";

import { Header } from "components/pages/feed";
import { ModalSpinner } from "components/templates";
import useFirebaseQuery from "hooks/useFirebaseQuery";

export default function Feed() {
  const infiniteScroll = useInfiniteScroll({
    queryKey: ["feed"],
    ...useFirebaseQuery("feed/posts"),
  });

  useScrollBack();

  if (infiniteScroll.isLoading) return <ModalSpinner />;

  return (
    <>
      <Header />
      <InfinitePosts
        numCols={1}
        infiniteScroll={infiniteScroll}
        lastPage={
          <Message
            icon="wink"
            message="모두 확인했습니다"
            detailedMessage="팔로잉중인 아카이버들의 게시물을 모두 확인했습니다"
          />
        }
      />
    </>
  );
}
