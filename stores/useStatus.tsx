import { IDict } from "types/common";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IStatus {
  scrolls: IDict<number>;
  selectedTabs: IDict<number>;

  setScroll: {
    (pathname: string, scroll: number): void;
    (pathname: string[], scroll: number[]): void;
  };
  setSelectedTab: (pathname: string, tab: number) => void;
}

export const useStatus = create<IStatus>()(
  devtools((set, get) => ({
    scrolls: {},
    selectedTabs: {},

    setScroll: (pathname: string | string[], scroll: number | number[]) => {
      if (typeof pathname === "string" && typeof scroll === "number") {
        set((state: IStatus) => {
          return {
            ...state,
            scrolls: { ...state.scrolls, [pathname]: scroll },
          };
        });
      } else {
        set((state: IStatus) => {
          const tPathname = pathname as string[];
          const tScroll = scroll as number[];
          const newState = { ...state };
          tPathname.forEach((path, i) => {
            newState.scrolls[path] = tScroll[i];
          });
          return newState;
        });
      }
    },
    setSelectedTab: (pathname: string, selectedTab: number) => {
      set((state: IStatus) => {
        return {
          ...state,
          selectedTabs: {
            ...state.selectedTabs,
            [pathname]: selectedTab,
          },
        };
      });
    },
  }))
);
