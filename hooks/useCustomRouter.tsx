import { NextRouter, useRouter } from "next/router";

import { Url } from "url";
import { useStatus } from "stores/useStatus";

export interface TransitionOptions {
  locale?: string | false | undefined;
  scroll?: boolean | undefined;
  shallow?: boolean | undefined;
  unstable_skipClientCache?: boolean | undefined;
}

export default function useCustomRouter() {
  const router = useRouter();
  const { selectedTabs, setScroll } = useStatus();
  const path = router.asPath;

  const customRouter: NextRouter = {
    ...router,
  };

  customRouter.push = async (
    url: Url,
    as?: Url | undefined,
    options?: TransitionOptions | undefined
  ) => {
    if (selectedTabs[path] !== undefined) {
      const selectedTab = selectedTabs[path];
      setScroll(
        [path, path + "/" + selectedTab],
        [
          document.querySelector("#refScroll")?.scrollTop || 0,
          document.querySelector(`#refScrollTab${selectedTab}`)?.scrollTop || 0,
        ]
      );
    } else {
      setScroll(path, window.scrollY);
    }
    return router.push(url, as, options);
  };

  return customRouter;
}
