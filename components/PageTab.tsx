import { useRouter } from "next/router";
import { Children, useEffect, useRef } from "react";
import { ICacheType } from "../stores/useCacheHelper";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import PagePosts, { IPagePostsProps } from "./PagePosts";
import PageScraps from "./PageScraps";
import PageTags, { IPageTagsProps } from "./PageTags";
import PageUsers, { IPageUsersProps } from "./PageUsers";
import WrapScrollTab from "./wrappers/WrapScrollTab";

// 하나의 route에 tab을 통해서 여러개의 infiniteScrollPage를 만들 수 있는 컴포넌트

// header: tab 상단에 display될 요소.
// tab은 페이지를 스크롤해도 상단에 sticky되는 반면, header는 위로 스크롤되어 사라진다.

// tabs: 각각의 tab에 대한 정보를 담고있는 데이터

// ! 각각의 tab의 스크롤을 저장하는 경우는 두가지이다.
// 다른 탭으로 넘어갈 때, 그리고 다른 상세 페이지로 넘어갔다가 돌아올 때

interface IPageTapProps {
  header: React.ReactNode;
  tabs: IDataType[];
}

type IDataType = IPostsType | IUsersType | ITagsType;

type IPostsType = IPagePostsProps & ITabType;
type IUsersType = IPageUsersProps & ITabType;
type ITagsType = IPageTagsProps & ITabType;

type ITabType = {
  type: "posts" | "users" | "tags" | "scraps";
  label: string;
};

export default function PageTab({ header, tabs }: IPageTapProps) {
  const router = useRouter();
  const tabRef = useRef<HTMLDivElement>(null);
  const scrollRefs = useRef<HTMLDivElement[]>([]);
  scrollRefs.current = [];

  const { scroll, setScroll, pages, setSelectedPage } = useStatus();

  const path = router.asPath;
  const page = pages[path] && pages[path].selectedPage;

  // 각각의 tab에 대한 scroll 값을 가지고 있는 container에 대한 ref인 scrollRefs를 init한다
  // 또한 init과 동시에 만약 현재 tab에 대한 scroll이 저장되어 있다면 해당 tab을 해당 위치로 스크롤시킨다.
  function addScrollRefs(e: HTMLDivElement | null, i: number) {
    if (page === i) {
      e?.scrollTo(0, scroll[path + "/" + page]);
    }
    e && scrollRefs.current.push(e);
  }

  // tab을 클릭하면 해당 tab에 대한 scroll을 저장하고 page를 변경한다.
  function onTabClick(i: number) {
    setScroll(path + "/" + page, scrollRefs.current[page]?.scrollTop || 0);
    setSelectedPage(path, i);
  }

  // page가 변경될때 변경되는 tab에 대한 scroll이 저장되어 있다면 해당 tab을 해당 위치로 스크롤시킨다.
  useEffect(() => {
    if (page !== undefined && scrollRefs.current[page])
      scrollRefs.current[page].scrollTo(0, scroll[path + "/" + page]);
    else setSelectedPage(path, 0);
  }, [page]);

  return (
    <>
      <div className="static h-[100vh] overflow-y-scroll">
        <div>{header}</div>
        <div
          ref={tabRef}
          className="box-border sticky top-0 z-10 flex py-4 mx-4 bg-white"
        >
          {Children.toArray(
            tabs.map((tab, i) => (
              <Btn
                label={tab.label}
                onClick={() => onTabClick(i)}
                width="full"
                isActive={page === i}
                className={i === 0 ? "" : "ml-2"}
              />
            ))
          )}
        </div>
        {Children.toArray(
          tabs.map((tab, i) => (
            // 각 tab의 가장 상위 div는 relative로 설정하여
            // 하위 div에서 absolute 등을 사용할 때에 해당 div에 종속적이도록 만들어준다.
            <WrapScrollTab path={path + "/" + page} className="relative">
              <div
                id="refScroll"
                className="absolute w-full overflow-auto duration-300 h-[100vh]"
                style={{
                  // height을 전체 뷰포트 - tabHeight로 설정해서 상단에 sticky한 tab과 겹치지 않도록 한다.
                  height: `calc(100vh - ${tabRef.current?.clientHeight}px)`,
                  transform: `translateX(${(i - page) * 100}%)`,
                }}
                ref={(e) => addScrollRefs(e, i)}
              >
                <div>
                  {tab.type === "posts" && (
                    <PagePosts
                      fetchType={tab.fetchType as ICacheType}
                      numCols={(tab as IPostsType).numCols}
                    />
                  )}
                  {tab.type === "users" && (
                    <PageUsers fetchType={tab.fetchType as ICacheType} />
                  )}
                  {tab.type === "scraps" && (
                    <PageScraps fetchType={tab.fetchType as ICacheType} />
                  )}
                  {tab.type === "tags" && (
                    <PageTags fetchType={tab.fetchType as ICacheType} />
                  )}
                </div>
              </div>
            </WrapScrollTab>
          ))
        )}
      </div>
    </>
  );
}
