import { NextRouter, useRouter } from "next/router";

import { Url } from "url";
import { useStatus } from "../stores/useStatus";

// router에 관련된 여러가지 처리들을 도와주는 custom router를 위한 훅

export interface TransitionOptions {
  locale?: string | false | undefined;
  scroll?: boolean | undefined;
  shallow?: boolean | undefined;
  unstable_skipClientCache?: boolean | undefined;
}

export default function useCustomRouter() {
  const router = useRouter();

  const { pages, setScroll } = useStatus();

  const path = router.asPath;

  const customRouter: NextRouter = {
    ...router,
  };

  customRouter.push = async (
    url: Url,
    as?: Url | undefined,
    options?: TransitionOptions | undefined
  ) => {
    // 만약 tab이 있는 페이지라면 refScroll과 refScrollTab의 스크롤을 모두 저장한다.
    // 만약 tab이 없는 페이지라면 window의 스크롤만을 저장한다.
    if (pages[path]) {
      const selectedPage = pages[path].selectedPage;
      setScroll(
        [path, path + "/" + selectedPage],
        [
          document.querySelector("#refScroll")?.scrollTop || 0,
          document.querySelector(`#refScrollTab${selectedPage}`)?.scrollTop ||
            0,
        ]
      );
    } else {
      setScroll(path, window.scrollY);
    }
    return router.push(url, as, options);
  };

  return customRouter;
}
