import { Router, useRouter } from "next/router";
import { Children, useEffect, useState } from "react";
import { useStatus } from "../stores/useStatus";
import Btn from "./atoms/Btn";
import Page from "./Page";
import { IPageProps } from "./Page";
import WrapScroll from "./wrappers/WrapScroll";

interface ITabPageProps {
  tabs: ITabPage[];
}

type ITabPage = IPageProps & {
  label: string;
};

export default function TabPage({ tabs }: ITabPageProps) {
  // const [page, setPage] = useState(0);
  const [scrollRefId, setScrollRefId] = useState("");
  const router = useRouter();
  const { pages, setSelectedPage } = useStatus();
  const { scroll } = useStatus();

  const path = router.asPath;
  const selectedPage = pages[path] && pages[path].selectedPage;

  const storage = globalThis?.sessionStorage;
  const prevPath = storage.getItem("currentPath");

  useEffect(() => {
    console.log(prevPath);
    if (selectedPage !== undefined) {
      const split = prevPath?.split("/");
      split && setScrollRefId(split[2]);
    } else {
      setSelectedPage(path, 0);
    }
  }, []);

  return (
    <>
      <div className="flex h-full m-4">
        {Children.toArray(
          tabs.map((tab, i) => (
            <Btn
              label={tab.label}
              onClick={() => setSelectedPage(path, i)}
              style={{
                width: "100%",
                marginRight: i === tabs.length - 1 ? "" : "0.25rem",
              }}
              isActive={selectedPage === i}
            />
          ))
        )}
      </div>
      <div className="h-[calc(100vh_-_15rem)] mb-[5.75rem] overflow-scroll relative">
        {Children.toArray(
          tabs.map((tab, i) => (
            <WrapScroll
              path={`${path}/${i}`}
              className="h-[calc(100vh_-_15rem)] absolute w-full duration-300"
              style={{ transform: `translateX(${(i - selectedPage) * 100}%)` }}
            >
              <Page
                page={tab.page}
                data={tab.data}
                onIntersect={tab.onIntersect}
                onChange={tab.onChange}
                onRefresh={tab.onRefresh}
                changeListener={tab.changeListener}
                scrollRefId={scrollRefId}
              />
            </WrapScroll>
          ))
        )}
      </div>
    </>
  );
}
