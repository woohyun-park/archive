import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../apis/def";

interface IUseStatus {
  modalLoader: boolean;
  logoutLoader: boolean;
  scroll: IDict<number>;
  pages: IDict<IPageStatus>;
  keywords: IDict<string>;
  refreshes: IDict<boolean>;
  notifyAlarms: boolean;

  setScroll: ISetScroll;
  setSelectedPage: (pathname: string, page: number) => void;
  setPageScrolls: (pathname: string, page: number, scroll: number) => void;
  setKeywords: (path: string, keyword: string) => void;
  setModalLoader: (modalLoader: boolean) => void;
  setLogoutLoader: (logoutLoader: boolean) => void;
  setRefresh: (pathname: string, refresh: boolean) => void;
  setNotifyAlarms: (notifyAlarms: boolean) => void;
}

interface IPageStatus {
  selectedPage: number;
  pageScrolls: IDict<string>;
}

interface ISetScroll {
  (pathname: string, scroll: number): void;
  (pathname: string[], scroll: number[]): void;
}

export const useStatus = create<IUseStatus>()(
  devtools((set, get) => ({
    modalLoader: true,
    logoutLoader: false,
    scroll: {},
    pages: {},
    keywords: {},
    refreshes: {},
    notifyAlarms: false,

    setNotifyAlarms: (notifyAlarms: boolean) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          notifyAlarms,
        };
      });
    },
    setRefresh: (pathname: string, refresh: boolean) => {
      set((state: IUseStatus) => {
        const refreshes = state.refreshes;
        refreshes[pathname] = refresh;
        return {
          ...state,
          refreshes,
        };
      });
    },
    setScroll: (pathname: string | string[], scroll: number | number[]) => {
      if (typeof pathname === "string" && typeof scroll === "number") {
        set((state: IUseStatus) => {
          return {
            ...state,
            scroll: { ...state.scroll, [pathname]: scroll },
          };
        });
      } else {
        set((state: IUseStatus) => {
          const tPathname = pathname as string[];
          const tScroll = scroll as number[];
          const newState = { ...state };
          tPathname.forEach((path, i) => {
            newState.scroll[path] = tScroll[i];
          });
          return newState;
        });
      }
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
    setLogoutLoader: (logoutLoader: boolean) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          logoutLoader,
        };
      });
    },
  }))
);
