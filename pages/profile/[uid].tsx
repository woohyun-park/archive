import { ITag, IUser } from "apis/def";
import { useCustomRouter, useInfiniteScroll, useScrollBack } from "hooks";

import Header from "components/pages/profile/Header";
import { InfinitePosts } from "components/common";
import InfiniteScraps from "components/common/InfiniteScraps";
import InfiniteTags from "components/common/InfiniteTags";
import { ModalSpinner } from "components/templates";
import PageTabNew from "components/common/PageTab";
import { readData } from "apis/firebase";
import useFirebaseQuery from "hooks/useFirebaseQuery";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "providers";

export default function Profile() {
  const router = useCustomRouter();
  const uid = router.query.uid as string;

  const { data: curUser } = useUser();
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [`profile/${uid}`, "user"],
    queryFn: () => readData<IUser>("users", uid),
  });
  const infinitePosts = useInfiniteScroll({
    queryKey: [`profile/${uid}`, "posts"],
    ...useFirebaseQuery("profile/posts"),
  });
  const infiniteScraps = useInfiniteScroll({
    queryKey: [`profile/${uid}`, "scraps"],
    ...useFirebaseQuery("profile/scraps"),
  });
  const infiniteTags = useInfiniteScroll({
    queryKey: [`profile/${uid}`, "tags"],
    ...useFirebaseQuery("profile/tags"),
  });

  useScrollBack();

  // // TODO: posts 총 갯수 따로 가져오기
  // const posts =
  //   (caches[router.asPath] &&
  //     caches[router.asPath].posts &&
  //     caches[router.asPath].posts.data) ||
  //   [];

  if (
    !user ||
    isUserLoading ||
    infinitePosts.isLoading ||
    infiniteScraps.isLoading ||
    infiniteTags.isLoading
  )
    return <ModalSpinner />;

  return (
    <>
      <PageTabNew
        header={<Header curUser={curUser} user={user} />}
        tabs={[
          {
            label: "posts",
            children: (
              <InfinitePosts
                numCols={3}
                infiniteScroll={infinitePosts}
                className="m-4"
              />
            ),
          },
          {
            label: "scraps",
            children: <InfiniteScraps infiniteScroll={infiniteScraps} />,
          },
          {
            label: "tags",
            children: (
              <InfiniteTags
                infiniteScroll={infiniteTags}
                onClick={(tag: ITag) =>
                  router.push(`/profile/${uid}/tags/${tag.name}`)
                }
              />
            ),
          },
        ]}
      />
    </>
  );
}
