import { useEffect } from "react";
import { useStatus } from "../stores/useStatus";
import useCustomRouter from "./useCustomRouter";

// 페이지를 이동할 때 scroll 값이 저장되어있는 경우 해당 scroll 위치로 자동으로 이동하도록 도와주는 훅
// 해당 functionality를 사용하고자 하는 페이지에서 useScrollBack()을 실행해주기만 하면 된다.

export const useScrollBack = () => {
  const router = useCustomRouter();
  const { scroll, pages, refreshes, setScroll } = useStatus();

  const path = router.asPath;

  useEffect(() => {
    if (refreshes[path]) {
      setScroll(path, 0);
    } else if (scroll[path]) {
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
