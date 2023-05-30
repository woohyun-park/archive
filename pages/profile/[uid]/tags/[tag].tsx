import { useInfiniteScroll, useScrollBack } from "hooks";

import BtnIcon from "components/atoms/BtnIcon";
import { IUser } from "apis/def";
import { InfinitePosts } from "components/common";
import { WrapMotionFade } from "components/wrappers/motion";
import { readData } from "apis/firebase/fbRead";
import useFirebaseQuery from "hooks/useFirebaseQuery";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function ProfileTag({}) {
  const router = useRouter();
  const { tag, uid } = router.query;
  const { data: user } = useQuery({
    queryKey: [`profile/${uid}`, "user"],
    queryFn: () => readData<IUser>("users", uid as string),
  });
  const infiniteScroll = useInfiniteScroll({
    queryKey: [`profile/${uid}/tags/${tag}`],
    ...useFirebaseQuery("profile/tags/detail"),
  });

  useScrollBack();

  return (
    <WrapMotionFade>
      <div className="flex items-center justify-center mt-2">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-sm">#{tag}</div>
      </div>
      <div className="top-0 m-auto text-xs text-center text-gray-2f">
        {user?.displayName}
      </div>
      <InfinitePosts numCols={1} infiniteScroll={infiniteScroll} />
    </WrapMotionFade>
  );
}
