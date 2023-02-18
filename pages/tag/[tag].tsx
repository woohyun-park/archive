import { useRouter } from "next/router";
import { useEffect } from "react";
import BtnIcon from "../../components/atoms/BtnIcon";
import Page from "../../components/Page";
import WrapScroll from "../../components/wrappers/WrapScroll";
import Motion from "../../components/wrappers/WrapMotion";
import { useModal } from "../../stores/useModal";
import { useStatus } from "../../stores/useStatus";
import { useCache } from "../../stores/useCache";
import { IPost } from "../../libs/custom";

export default function Tag({}) {
  const router = useRouter();

  const { setModalLoader, modalLoader } = useModal();
  const { scroll } = useStatus();
  const { caches, fetchTagPage } = useCache();

  const path = router.asPath;
  const tag = router.query.tag as string;
  const cache = caches[path];
  const posts = cache && (cache.data as IPost[]);

  useEffect(() => {
    async function init() {
      if (scroll[path] === undefined) {
        await fetchTagPage("init", path, tag);
        setModalLoader(false);
        scrollTo(0, 0);
      } else {
        console.log("2");
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
            data={posts}
            onIntersect={() => fetchTagPage("load", path, tag)}
            onChange={() => {}}
            onRefresh={async () => {
              await fetchTagPage("refresh", path, tag);
            }}
            changeListener={posts}
          />
        </>
      )}
    </Motion>
  );
}
