import { collection, doc, orderBy, query, where } from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { db, getDataByRef } from "../apis/firebase";
import { IPost, ITag, IUser } from "../libs/custom";
import {
  combinePrevAndNewPosts,
  getPostsByQuery,
  getQueryByType,
  setCursorByType,
} from "./useFeedHelper";

interface ISearchStore {
  posts: IPost[];
  tags: ITag[];
  users: IUser[];

  keyword: string;
  setKeyword: (keyword: string) => void;
}

export const useSearch = create<ISearchStore>()(
  devtools((set, get) => ({
    posts: [],
    tags: [],
    users: [],
    keyword: "",
    setKeyword: (keyword: string) => {
      set((state: ISearchStore) => {
        return {
          ...state,
          keyword,
        };
      });
    },
  }))
);
