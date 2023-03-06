import { NextRouter, useRouter } from "next/router";
import { useStatus } from "../stores/useStatus";

interface CustomNextRouter {
  pushWithLoader?: (href: string) => void;
}

export default function useCustomRouter() {
  const router: NextRouter & CustomNextRouter = useRouter();

  const { setModalLoader } = useStatus();

  function pushWithLoader(href: string) {
    setModalLoader(true);
    router.push(href);
  }

  router.pushWithLoader = pushWithLoader;

  return router;
}
