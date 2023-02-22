import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Children, useEffect, useRef, useState } from "react";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import PagePosts, { IPagePostsProps } from "./PagePosts";
import PageTags, { IPageTagsProps } from "./PageTags";
import PageUsers, { IPageUsersProps } from "./PageUsers";
import WrapScrollTab from "./wrappers/WrapScrollTab";

// 하나의 route에 tab을 통해서 여러개의 infiniteScrollPage를 만들 수 있는 컴포넌트

// header: tab 상단에 display될 요소.
// tab은 페이지를 스크롤해도 상단에 sticky되는 반면, header는 위로 스크롤되어 사라진다.

// tabs: 각각의 tab에 대한 정보를 담고있는 데이터

interface IPageTapProps {
  header: React.ReactNode;
  tabs: IDataType[];
}

type IDataType = IPostsType | IUsersType | ITagsType;

type ITabType = {
  type: "posts" | "users" | "tags";
  label: string;
};

type IPostsType = IPagePostsProps & ITabType;
type IUsersType = IPageUsersProps & ITabType;
type ITagsType = IPageTagsProps & ITabType;

export default function PageTab({ header, tabs }: IPageTapProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [tabHeight, setTabHeight] = useState(0);

  const { scroll, setScroll, pages, setSelectedPage } = useStatus();

  const path = router.asPath;
  const page = pages[path] && pages[path].selectedPage;

  useEffect(() => {
    if (page !== undefined) ref.current?.scrollTo(0, scroll[path + "/" + page]);
    else setSelectedPage(path, 0);
  }, [page]);

  useEffect(() => {
    setHeaderHeight(headerRef.current?.clientHeight || 0);
    setTabHeight(tabRef.current?.clientHeight || 0);
    document.body.style.height = `calc(100vh + ${
      headerRef.current?.clientHeight || 0
    }px)`;
  }, [headerRef, tabRef]);

  return (
    <>
      <div className="relative h-[100vh] overflow-hidden">
        <div ref={headerRef}>{header}</div>
        <div className="sticky top-0 z-10 h-8" ref={tabRef}>
          <div className="flex px-4 py-4 bg-white">
            {Children.toArray(
              tabs.map((tab, i) => (
                <Btn
                  label={tab.label}
                  onClick={() => {
                    setScroll(path + "/" + page, ref.current?.scrollTop || 0);
                    setSelectedPage(path, i);
                  }}
                  style={{
                    width: "100%",
                    marginRight: i === tabs.length - 1 ? "" : "0.25rem",
                  }}
                  isActive={page === i}
                />
              ))
            )}
          </div>
        </div>
        {Children.toArray(
          tabs.map((tab, i) => (
            <WrapScrollTab path={path + "/" + page}>
              <div
                id="refScroll"
                className="absolute w-full overflow-auto"
                style={{
                  height: `calc(100vh - ${headerHeight + tabHeight}px)`,
                  transform: `translateX(${(i - page) * 100}%)`,
                }}
                ref={page === i ? ref : null}
              >
                <div>
                  <div>
                    <div
                      className="mb-16"
                      style={{
                        paddingTop: `${tabHeight}px`,
                      }}
                    >
                      <div
                        className="w-full duration-300"
                        style={{
                          transform: `translateX(${(i - page) * 100}%)`,
                        }}
                      >
                        {tab.type === "posts" && (
                          <PagePosts
                            fetchType={tab.fetchType}
                            numCol={(tab as IPostsType).numCol}
                          />
                        )}
                        {tab.type === "users" && (
                          <PageUsers fetchType={tab.fetchType} />
                        )}
                        {tab.type === "tags" && (
                          <PageTags fetchType={tab.fetchType} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </WrapScrollTab>
          ))
        )}
      </div>
    </>
  );
}
