import { Children, useState } from "react";
import Btn from "./atoms/Btn";
import Page from "./Page";
import { IPageProps } from "./Page";

interface ITabPageProps {
  tabs: ITabPage[];
}

type ITabPage = IPageProps & {
  label: string;
};

export default function TabPage({ tabs }: ITabPageProps) {
  const [page, setPage] = useState(0);

  return (
    <>
      <div className="flex h-full m-4">
        {Children.toArray(
          tabs.map((tab, i) => (
            <Btn
              label={tab.label}
              onClick={() => setPage(i)}
              style={{
                width: "100%",
                marginRight: i === tabs.length - 1 ? "" : "0.25rem",
              }}
              isActive={page === i}
            />
          ))
        )}
      </div>
      <div className="h-[calc(100vh_-_15rem)] mb-[5.75rem] overflow-scroll relative">
        {Children.toArray(
          tabs.map((tab, i) => (
            <div
              className="h-[calc(100vh_-_15rem)] absolute w-full duration-300"
              style={{ transform: `translateX(${(i - page) * 100}%)` }}
            >
              <Page
                page={tab.page}
                data={tab.data}
                onIntersect={tab.onIntersect}
                onChange={tab.onChange}
                onRefresh={tab.onRefresh}
                changeListener={tab.changeListener}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
