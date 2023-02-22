import { useRouter } from "next/router";
import { Children, useEffect, useRef, useState } from "react";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import Page from "./Page";
import { IPageProps } from "./Page";
import WrapScrollTab from "./wrappers/WrapScrollTab";

interface IPageTapProps {
  header: React.ReactNode;
  tabs: ITabPage[];
}

type ITabPage = IPageProps & {
  type: "postColTwo" | "default";
  label: string;
};

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
    console.log(ref);
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
                        <Page
                          page={tab.page}
                          data={tab.data}
                          onIntersect={tab.onIntersect}
                          onChange={tab.onChange}
                          onRefresh={tab.onRefresh}
                          changeListener={tab.changeListener}
                          isLast={tab.isLast}
                        />
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
