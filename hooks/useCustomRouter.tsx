import { NextRouter, useRouter } from "next/router";
import { wrapPromise } from "../stores/libStores";
import { useCache } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";

interface CustomNextRouter {
  pushWithLoader: (href: string) => void;
}

export default function useCustomRouter() {
  const router = useRouter();

  const { setModalLoader } = useStatus();
  const { caches } = useCache();

  const customRouter: NextRouter & CustomNextRouter = {
    ...router,
    pushWithLoader,
  };

  async function pushWithLoader(href: string) {
    if (!caches[href]) await wrapPromise(() => setModalLoader(true), 500);
    customRouter.push(href);
  }

  return customRouter;
}
