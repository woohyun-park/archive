import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import Page from "../../components/Page";
import WrapScroll from "../../components/wrappers/WrapScroll";
import Motion from "../../components/wrappers/WrapMotion";
import { useModal } from "../../stores/useModal";
import { useTag } from "../../stores/useTag";
import { useStatus } from "../../stores/useStatus";

export default function Tag({}) {
  const { setModalLoader, modalLoader } = useModal();
  const { scroll } = useStatus();
  const { dictPosts, getPosts } = useTag();

  const router = useRouter();

  const tag = router.query.tag as string;

  useEffect(() => {
    async function init() {
      if (scroll[router.asPath] === undefined) {
        console.log("1");
        await getPosts("init", tag);
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        console.log("2");
        scrollTo(0, scroll[router.asPath]);
      }
    }
    init();
  }, []);

  return (
    <Motion type="fade">
      {!modalLoader && (
        <>
          <div className="flex items-center justify-center mt-2 mb-4">
            <WrapScroll className="absolute left-0 flex ml-4">
              <BtnIcon icon="back" onClick={() => router.back()} />
            </WrapScroll>
            <div className="title-page-sm">#{tag}</div>
          </div>
          {dictPosts[tag] && (
            <Page
              page="feed"
              data={dictPosts[tag]}
              onIntersect={() => getPosts("load", tag)}
              onChange={() => {}}
              onRefresh={async () => {
                await getPosts("refresh", tag);
              }}
              changeListener={dictPosts[tag]}
            />
          )}
        </>
      )}
    </Motion>
  );
}
