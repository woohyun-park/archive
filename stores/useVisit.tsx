import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";

interface IUseVisit {
  visit: IDict<boolean>;
  setVisit: (pathname: string) => void;
}

export const useVisit = create<IUseVisit>()(
  devtools((set, get) => ({
    visit: {},
    setVisit: (pathname: string) => {
      set((state: IUseVisit) => {
        const newVisit = { ...state.visit };
        newVisit[pathname] = true;
        return {
          ...state,
          visit: newVisit,
        };
      });
    },
  }))
);
