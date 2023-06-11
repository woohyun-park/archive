import useCustomRouter from "hooks/useCustomRouter";
import { useEffect } from "react";
import { useStatus } from "stores/useStatus";

// 페이지를 이동할 때 scroll 값이 저장되어있는 경우 해당 scroll 위치로 자동으로 이동하도록 도와주는 훅
// 사용법: 해당 기능을 사용하고자 하는 페이지에서 useScrollBack()을 실행

export default function useScrollBack() {
  const router = useCustomRouter();
  const { scrolls, selectedTabs } = useStatus();

  const path = router.asPath;

  useEffect(() => {
    // 만약 scroll이 저장되어 있다면
    // 1. selectedTab이 존재한다면 tab으로 구성되는 페이지이므로
    // refScroll과 refScrollTab 각각을 저장된 위치로 스크롤한다
    // 2. selectedTab이 존재하지 않는다면 window를 저장된 위치로 스크롤한다.
    if (scrolls[path]) {
      if (selectedTabs[path] !== undefined) {
        const selectedTab = selectedTabs[path];
        document.querySelector("#refScroll")?.scrollTo(0, scrolls[path]);
        document
          .querySelector(`#refScrollTab${selectedTab}`)
          ?.scrollTo(0, scrolls[path + "/" + selectedTab]);
      } else {
        window.scrollTo(0, scrolls[path]);
      }
    }
  }, []);
}
