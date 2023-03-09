import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCache } from "../stores/useCache";
import { useStatus } from "../stores/useStatus";

// 해당 페이지가 로딩이 되었는지를 확인해주는 훅

// checkInitiated: 로딩을 확인하고자 하는 데이터의 이름들
// e.g. profile 페이지의 경우 ["posts", "tags", "scraps"]

export const useLoading = (checkInitiated: string[]) => {
  const router = useRouter();

  const { setModalLoader } = useStatus();
  const { caches } = useCache();

  const path = router.asPath;

  function initiated() {
    // 모든 데이터가 initiated 되었는지 확인한다
    return checkInitiated.reduce(
      (acc, cur) =>
        acc && caches[path] !== undefined && caches[path][cur] !== undefined,
      true
    );
  }

  useEffect(() => {
    // 모든 데이터가 initiated 될때까지 500ms마다 체크한다.
    // 모든 데이터가 initiated 되었다면 modal을 사라지게 하고 interval을 삭제한다.
    let repeat = setInterval(function () {
      if (initiated()) {
        setModalLoader(false);
        clearInterval(repeat);
      }
    }, 500);
  }, []);
};
