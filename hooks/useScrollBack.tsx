import { useEffect } from "react";
import { useStatus } from "../stores/useStatus";
import { useCustomRouter } from "./useCustomRouter";

// 페이지를 이동할 때 scroll 값이 저장되어있는 경우 해당 scroll 위치로 자동으로 이동하도록 도와주는 훅
// 해당 functionality를 사용하고자 하는 페이지에서 useScrollBack()을 실행해주기만 하면 된다.

export const useScrollBack = () => {
  const router = useCustomRouter();
  const { scroll, pages, refreshes, setScroll } = useStatus();

  const path = router.asPath;

  useEffect(() => {
    // 만약 refresh가 설정되어 있다면 가장 상위로 스크롤한다.
    if (refreshes[path]) {
      setScroll(path, 0);
    }
    // 만약 scroll이 저장되어 있다면
    // 1. page가 존재한다면 pageTab으로 구성되는 페이지이므로
    // refScroll과 refScrollTab 각각을 저장된 위치로 스크롤한다
    // 2. page가 존재하지 않는다면 window를 저장된 위치로 스크롤한다.
    else if (scroll[path]) {
      if (pages[path]) {
        const selectedPage = pages[path].selectedPage;
        document.querySelector("#refScroll")?.scrollTo(0, scroll[path]);
        document
          .querySelector(`#refScrollTab${selectedPage}`)
          ?.scrollTo(0, scroll[path + "/" + selectedPage]);
      } else {
        window.scrollTo(0, scroll[path]);
      }
    }
  }, []);
};
