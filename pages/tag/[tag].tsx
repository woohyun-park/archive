import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import Page from "../../components/Page";
import WrapScroll from "../../components/wrappers/WrapScroll";
import Motion from "../../components/wrappers/WrapMotion";
import { useStatus } from "../../stores/useStatus";
import { useCache } from "../../stores/useCache";
import { IPost } from "../../libs/custom";
import { useCachedPage } from "../../hooks/useCachedPage";

export default function Tag({}) {
  const router = useRouter();

  const { scroll, setModalLoader, modalLoader } = useStatus();
  const { path, data, isLast, fetchTaggedPosts } = useCachedPage("taggedPosts");

  const tag = router.query.tag as string;

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        fetchTaggedPosts && (await fetchTaggedPosts("init", path, tag));
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        scrollTo(0, scroll[path]);
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
          <Page
            page="feed"
            data={data}
            onIntersect={() =>
              fetchTaggedPosts && fetchTaggedPosts("load", path, tag)
            }
            onChange={() => {}}
            onRefresh={async () => {
              fetchTaggedPosts &&
                (await fetchTaggedPosts("refresh", path, tag));
            }}
            changeListener={data}
          />
        </>
      )}
    </Motion>
  );
}
