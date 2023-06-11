import React, { Children, useRef } from "react";

import { useRouter } from "next/router";
import { useStatus } from "../../stores/useStatus";

// 하나의 route에 tab을 통해서 여러개의 infiniteScrollPage를 만들 수 있는 컴포넌트

// header: tab 상단에 display될 요소.
// tab은 페이지를 스크롤해도 상단에 sticky되는 반면, header는 위로 스크롤되어 사라진다.

// tabs: 각각의 tab에 대한 정보를 담고있는 데이터

// ! 각각의 tab의 스크롤을 저장하는 경우는 두가지이다.
// 다른 탭으로 넘어갈 때, 그리고 다른 상세 페이지로 넘어갔다가 돌아올 때

type ITab = {
  label: string;
  children: React.ReactNode;
};

type Props = {
  header: React.ReactNode;
  tabs: ITab[];
};

// ALERT: className 주지말것 !!!
// margin이나 padding은 다른 컴포넌트에서 처리

export default function PageTab({ header, tabs }: Props) {
  const router = useRouter();
  const tabRef = useRef<HTMLDivElement>(null);
  const scrollRefs = useRef<HTMLDivElement[]>([]);
  scrollRefs.current = [];

  const { setScroll, selectedTabs, setSelectedTab } = useStatus();

  const path = router.asPath;
  const page = selectedTabs[path] || 0;

  // 각각의 tab에 대한 scroll 값을 가지고 있는 container에 대한 ref인 scrollRefs를 init한다
  function addScrollRefs(e: HTMLDivElement | null, i: number) {
    e && scrollRefs.current.push(e);
  }

  // tab을 클릭하면 해당 tab에 대한 scroll을 저장하고 page를 변경한다.
  function onTabClick(i: number) {
    // setScroll(path + "/" + page, scrollRefs.current[page]?.scrollTop || 0);
    setScroll(
      [path, path + "/" + page],
      [
        document.querySelector("#refScroll")?.scrollTop || 0,
        document.querySelector(`#refScrollTab${page}`)?.scrollTop || 0,
      ]
    );
    setSelectedTab(path, i);
  }

  return (
    <>
      <div
        id="refScroll"
        className="static h-[100vh] overflow-y-scroll overflow-x-hidden"
        style={{ height: `calc(100vh + ${tabRef.current?.clientHeight}px)` }}
      >
        <>{header}</>
        <div
          ref={tabRef}
          className="box-border sticky top-0 z-10 flex bg-white border-b-gray-3 border-b-[1px]"
        >
          {Children.toArray(
            tabs.map((tab, i) => (
              <div
                className={
                  i === page
                    ? "w-full text-center font-bold border-gray-3 border-b-4 px-2 pt-6 pb-2 hover:cursor-pointer"
                    : "w-full text-center px-2 pt-6 pb-2 hover:cursor-pointer"
                }
                onClick={() => onTabClick(i)}
              >
                {tab.label}
              </div>
            ))
          )}
        </div>
        {Children.toArray(
          tabs.map((tab, i) => (
            // 각 tab의 가장 상위 div는 relative로 설정하여
            // 하위 div에서 absolute 등을 사용할 때에 해당 div에 종속적이도록 만들어준다.
            <div className="relative">
              <div
                id={`refScrollTab${i}`}
                className="absolute w-full overflow-auto duration-300 h-[100vh]"
                style={{ transform: `translateX(${(i - page) * 100}%)` }}
                ref={(e) => addScrollRefs(e, i)}
              >
                <div>{tab.children}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
