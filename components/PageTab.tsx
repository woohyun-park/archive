import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Children, useEffect, useRef, useState } from "react";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import PagePosts, { IPagePostsProps } from "./PagePosts";
import PageTags, { IPageTagsProps } from "./PageTags";
import PageUsers, { IPageUsersProps } from "./PageUsers";
import WrapScrollTab from "./wrappers/WrapScrollTab";
import { useCache } from "../stores/useCache";

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
  // const ref = useRef<HTMLDivElement>(null);
  // const articleRef = useRef<HTMLDivElement>(null);
  const scrollRefs = useRef<HTMLDivElement[]>([]);
  scrollRefs.current = [];
  const addToScrollRefs = (e: HTMLDivElement | null) => {
    e && scrollRefs.current.push(e);
  };
  const { caches } = useCache();
  const cache = caches[router.asPath];

  const articleRefs = useRef<HTMLDivElement[]>([]);
  articleRefs.current = [];
  const addToArticleRefs = (e: HTMLDivElement | null) => {
    e && articleRefs.current.push(e);
  };
  const headerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const [articleHeight, setArticleHeight] = useState<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [tabHeight, setTabHeight] = useState<number | null>(null);

  const { scroll, setScroll, pages, setSelectedPage } = useStatus();

  const path = router.asPath;
  const page = pages[path] && pages[path].selectedPage;

  useEffect(() => {
    if (page !== undefined) scrollRefs.current[page].scrollTo(0, scroll[path]);
    else setSelectedPage(path, 0);
  }, [page]);

  useEffect(() => {
    const newHeaderHeight = headerRef.current?.clientHeight || 0;
    const newTabHeight = tabRef.current?.clientHeight || 0;
    const newArticleHeight =
      articleRefs.current[page === undefined ? 0 : page]?.clientHeight || 0;
    console.log(
      "useEffect!",
      newHeaderHeight,
      newTabHeight,
      newArticleHeight,
      articleRefs
    );
    setHeaderHeight(newHeaderHeight);
    setTabHeight(newTabHeight);
    setArticleHeight(newArticleHeight);
    // document.body.style.height =
    //   tabHeight && articleHeight
    //     ? `min(100vh - ${tabHeight}px, ${tabHeight + articleHeight}px)`
    //     : "100vh";

    // contRef.current?.setAttribute(
    //   "style",
    //   `height: calc(100vh + ${newHeaderHeight}px)`
    // );
    document.body.style.height = `calc(100vh + ${newHeaderHeight}px)`;
    // console.log(
    //   window.innerHeight,
    //   newHeaderHeight + newTabHeight + newArticleHeight
    // );
    // if (
    //   window.innerHeight >=
    //   newHeaderHeight + newTabHeight + newArticleHeight
    // ) {
    //   document.body.style.overflow = "hidden";
    // }
  }, [page]);

  let init = cache && cache[tabs[0].fetchType];
  const [initState, setInitState] = useState(0);

  useEffect(() => {
    if (initState > 1) return;
    const newHeaderHeight = headerRef.current?.clientHeight || 0;
    const newTabHeight = tabRef.current?.clientHeight || 0;
    const newArticleHeight =
      articleRefs.current[page === undefined ? 0 : page]?.clientHeight || 0;
    setHeaderHeight(newHeaderHeight);
    setTabHeight(newTabHeight);
    setArticleHeight(newArticleHeight);
    // document.body.style.height =
    //   tabHeight && articleHeight
    //     ? `min(100vh - ${tabHeight}px, ${tabHeight + articleHeight}px)`
    //     : "100vh";
    document.body.style.height = `calc(100vh + ${newHeaderHeight}px)`;
    setInitState(initState + 1);
  }, [init]);

  // useEffect(() => {
  //   const newHeaderHeight = headerRef.current?.clientHeight || 0;
  //   const newTabHeight = tabRef.current?.clientHeight || 0;
  //   const newArticleHeight = articleRefs.current[page]?.clientHeight || 0;
  //   setHeaderHeight(newHeaderHeight);
  //   setTabHeight(newTabHeight);
  //   setArticleHeight(newArticleHeight);
  //   document.body.style.height =
  //     tabHeight && articleHeight
  //       ? `min(100vh - ${tabHeight}px, ${tabHeight + articleHeight}px)`
  //       : "100vh";
  // }, []);

  return (
    <>
      <div
        className="relative h-[100vh] overflow-hidden"
        style={{
          height: (() => {
            console.log(headerHeight, tabHeight, articleHeight);
            return headerHeight && tabHeight && articleHeight
              ? `${
                  window.innerHeight >= headerHeight + tabHeight + articleHeight
                    ? headerHeight + tabHeight + articleHeight
                    : window.innerHeight - tabHeight
                }px`
              : "";
          })(),
        }}
      >
        <div ref={headerRef}>{header}</div>
        <div className="sticky top-0 z-10 h-8" ref={tabRef}>
          <div className="flex px-4 py-4 bg-white">
            {Children.toArray(
              tabs.map((tab, i) => (
                <Btn
                  label={tab.label}
                  onClick={() => {
                    setScroll(
                      path + "/" + page,
                      scrollRefs.current[page]?.scrollTop || 0
                    );
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
                  height: `calc(100vh - ${tabHeight}px)`,
                  // height: `min(100vh - ${tabHeight}px, ${
                  //   tabHeight + articleHeight
                  // }px)`,
                  transform: `translateX(${(i - page) * 100}%)`,
                }}
                ref={(e) => addToScrollRefs(e)}
              >
                <div ref={(e) => addToArticleRefs(e)}>
                  <div>
                    <div
                      className="mb-36"
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
                            numCols={(tab as IPostsType).numCols}
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
