import { useFirebaseQuery, useInfiniteScroll } from "hooks";

import BtnIcon from "../../components/atoms/BtnIcon";
import { InfinitePosts } from "components/common";
import { WrapMotionFade } from "components/wrappers/motion";
import { useRouter } from "next/router";

export default function Tag({}) {
  const router = useRouter();
  const { tag } = router.query;

  const infiniteScroll = useInfiniteScroll({
    queryKey: [`tag/${tag}`],
    ...useFirebaseQuery("tag/posts"),
  });

  return (
    <WrapMotionFade>
      <div className="flex items-center justify-center mt-2 mb-4">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-sm">#{tag}</div>
      </div>
      <InfinitePosts infiniteScroll={infiniteScroll} numCols={1} />
    </WrapMotionFade>
  );
}
