import { Router, useRouter } from "next/router";
import { Children, useEffect, useRef, useState } from "react";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import Page from "./Page";
import { IPageProps } from "./Page";
import WrapScroll from "./wrappers/WrapScroll";
import WrapScrollPage from "./wrappers/WrapScrollPage";

interface ITabPageProps {
  tabs: ITabPage[];
}

type ITabPage = IPageProps & {
  label: string;
};

export default function TabPage({ tabs }: ITabPageProps) {
  const router = useRouter();
  const ref = useRef(null);
  const { scroll, setScroll, pages, setSelectedPage } = useStatus();

  const path = router.asPath;
  const page = pages[path] && pages[path].selectedPage;

  useEffect(() => {
    if (page !== undefined) {
      ref.current?.scrollTo(0, scroll[path + "/" + page]);
    } else {
      setSelectedPage(path, 0);
    }
  }, [page]);

  return (
    <>
      <div
        onClick={() => {
          setScroll(path + "/" + page, ref.current?.scrollTop);
        }}
      >
        <div className="flex h-full m-4">
          {Children.toArray(
            tabs.map((tab, i) => (
              <Btn
                label={tab.label}
                onClick={() => {
                  setScroll(path + "/" + page, ref.current?.scrollTop);
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
        <div className="h-[calc(100vh_-_13rem)] overflow-hidden relative">
          {Children.toArray(
            tabs.map((tab, i) => (
              // <div className="w-full h-[calc(100vh_-_15rem)] overflow-scroll absolute">
              <div
                className="w-full h-[calc(100vh_-_13rem)] overflow-scroll absolute duration-300"
                style={{
                  transform: `translateX(${(i - page) * 100}%)`,
                }}
                ref={page === i ? ref : null}
              >
                <div className="absolute w-full duration-300" id={`test${i}`}>
                  <Page
                    page={tab.page}
                    data={tab.data}
                    onIntersect={tab.onIntersect}
                    onChange={tab.onChange}
                    onRefresh={tab.onRefresh}
                    changeListener={tab.changeListener}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
