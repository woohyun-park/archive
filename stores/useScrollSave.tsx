import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";

interface IScrollSave {
  scroll: IDict<number>;
  setScroll: (pathname: string, scroll: number) => void;
}

export const useScrollSave = create<IScrollSave>()(
  devtools((set, get) => ({
    scroll: {},
    setScroll: (pathname: string, scroll: number) => {
      set((state: IScrollSave) => {
        state.scroll[pathname] = scroll;
        return {
          ...state,
        };
      });
    },
  }))
);
