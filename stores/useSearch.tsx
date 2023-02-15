import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getPostsByQuery } from "../apis/firebase";
import { IPost, ITag, IUser } from "../libs/custom";
import {
  FETCH_LIMIT,
  getSearchQueryByType,
  IFetchType,
} from "../libs/queryLib";
import { combineData, setCursor, wrapPromise } from "./libStores";

interface ISearchStore {
  posts: IPost[];
  isLast: boolean;

  getPosts: (type: IFetchType) => Promise<IPost[]>;

  setPosts: (posts: IPost[]) => void;

  tags: ITag[];
  users: IUser[];
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;

export const useSearch = create<ISearchStore>()(
  devtools((set, get) => ({
    posts: [],
    isLast: false,
    getPosts: async (type: IFetchType) => {
      const res = await wrapPromise(async () => {
        const q = getSearchQueryByType(type, lastVisible);
        let [snap, res] = await getPostsByQuery(q);
        const isLast = res.length < FETCH_LIMIT.post3 ? true : false;
        const posts = combineData(get().posts, res, type);
        const newLastVisible = setCursor(snap, type);
        if (newLastVisible) lastVisible = newLastVisible;
        return { posts, isLast };
      }, 1000);
      set((state: ISearchStore) => {
        return {
          ...state,
          posts: res.posts,
          isLast: res.isLast,
        };
      });
      return res.posts;
    },
    setPosts: (posts: IPost[]) => {
      set((state: ISearchStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    tags: [],
    users: [],
  }))
);
