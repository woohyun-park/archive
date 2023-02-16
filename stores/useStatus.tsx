import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";

interface IUseStatus {
  scroll: IDict<number>;

  setScroll: (pathname: string, scroll: number) => void;
}

export const useStatus = create<IUseStatus>()(
  devtools((set, get) => ({
    scroll: {},
    setScroll: (pathname: string, scroll: number) => {
      set((state: IUseStatus) => {
        return {
          ...state,
          scroll: { ...state.scroll, [pathname]: scroll },
        };
      });
    },
  }))
);
