import { useScroll } from "framer-motion";
import { NextRouter, useRouter } from "next/router";
import { Url } from "url";
import { wrapPromise } from "../stores/libStores";
import { useCache } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";

// 페이지를 이동할 때 이미 cache되어있는 페이지라면 로딩화면을 띄우지 않고,
// 데이터를 받아와야하는 페이지라면 로딩화면을 띄우도록 도와주는 custom router를 위한 훅

interface TransitionOptions {
  locale?: string | false | undefined;
  scroll?: boolean | undefined;
  shallow?: boolean | undefined;
  unstable_skipClientCache?: boolean | undefined;
}

export default function useCustomRouter() {
  const router = useRouter();

  const { setModalLoader } = useStatus();
  const { caches } = useCache();
  const { setScroll } = useStatus();

  const customRouter: NextRouter = {
    ...router,
  };

  // 이 함수에서 만약 이동하고자 하는 페이지의 cache가 존재하지 않는다면
  // 로딩창을 띄운 뒤에 route로 push를 하여 자연스러운 페이지이동이 가능토록 한다.
  customRouter.push = async (
    url: Url,
    as?: Url | undefined,
    options?: TransitionOptions | undefined
  ) => {
    if (!caches[String(url)])
      await wrapPromise(() => setModalLoader(true), 500);
    setScroll(router.asPath, window.scrollY);
    return router.push(url, as, options);
  };

  return customRouter;
}
