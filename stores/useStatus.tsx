import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";

interface IUseStatus {
  scroll: IDict<number>;
  keywords: IDict<string>;

  setScroll: (pathname: string, scroll: number) => void;
  setKeywords: (path: string, keyword: string) => void;
}

export const useStatus = create<IUseStatus>()(
  devtools((set, get) => ({
    scroll: {},
    keywords: {},
    setScroll: (pathname: string, scroll: number) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          scroll: { ...state.scroll, [pathname]: scroll },
        };
      });
    },
    setKeywords: (path: string, keyword: string) => {
      set((state: IUseStatus) => {
        const keywords = { ...state.keywords };
        keywords[path] = keyword;
        return {
          ...state,
          keywords,
        };
      });
    },
  }))
);
