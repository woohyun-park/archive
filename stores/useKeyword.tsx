import create from "zustand";
import { devtools } from "zustand/middleware";
import { IDict } from "../libs/custom";

interface IKeywordStore {
  keywords: IDict<string>;
  setKeywords: (path: string, keyword: string) => void;
}

export const useKeyword = create<IKeywordStore>()(
  devtools((set, get) => ({
    keywords: {},
    setKeywords: (path: string, keyword: string) => {
      set((state: IKeywordStore) => {
        const keywords = state.keywords;
        keywords[path] = keyword;
        return {
          ...state,
          keywords,
        };
      });
    },
  }))
);
