import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCache } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";

export const useLoading = (checkInitiated: string[]) => {
  const router = useRouter();

  const { setModalLoader } = useStatus();
  const { caches } = useCache();

  const path = router.asPath;

  function initiated() {
    return checkInitiated.reduce(
      (acc, cur) =>
        acc && caches[path] !== undefined && caches[path][cur] !== undefined,
      true
    );
  }

  useEffect(() => {
    let repeat = setInterval(function () {
      if (initiated()) {
        setModalLoader(false);
        clearInterval(repeat);
      }
    }, 500);
  }, []);
};
