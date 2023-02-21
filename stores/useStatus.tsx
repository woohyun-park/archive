import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";

interface IUseStatus {
  modalLoader: boolean;
  scroll: IDict<number>;
  pages: IDict<IPageStatus>;
  keywords: IDict<string>;

  setScroll: (pathname: string, scroll: number) => void;
  setSelectedPage: (pathname: string, page: number) => void;
  setPageScrolls: (pathname: string, page: number, scroll: number) => void;
  setKeywords: (path: string, keyword: string) => void;
  setModalLoader: (modalLoader: boolean) => void;
}

interface IPageStatus {
  selectedPage: number;
  pageScrolls: IDict<string>;
}

export const useStatus = create<IUseStatus>()(
  devtools((set, get) => ({
    modalLoader: true,
    scroll: {},
    pages: {},
    keywords: {},
    setScroll: (pathname: string, scroll: number) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          scroll: { ...state.scroll, [pathname]: scroll },
        };
      });
    },
    setSelectedPage: (pathname: string, selectedPage: number) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          pages: {
            ...state.pages,
            [pathname]: { ...state.pages[pathname], selectedPage },
          },
        };
      });
    },
    setPageScrolls: (pathname: string, page: number, scroll: number) => {
      set((state: IUseStatus) => {
        const pageScrolls = {
          ...state.pages[pathname].pageScrolls,
          [page]: scroll,
        };
        return {
          ...state,
          pages: {
            ...state.pages,
            [pathname]: { ...state.pages[pathname], pageScrolls },
          },
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
    setModalLoader: (modalLoader: boolean) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          modalLoader,
        };
      });
    },
  }))
);
