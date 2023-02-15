import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getPostsByQuery } from "../apis/firebase";
import { IPost, ITag, IUser } from "../libs/custom";
import { getSearchQueryByType, IFetchType } from "../libs/queryLib";
import { combineData, setCursor } from "./libStores";

interface ISearchStore {
  posts: IPost[];
  getPosts: (type: IFetchType) => Promise<void>;

  tags: ITag[];
  users: IUser[];
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;

export const useSearch = create<ISearchStore>()(
  devtools((set, get) => ({
    posts: [],
    getPosts: async (type: IFetchType) => {
      let posts: IPost[] = [];
      await Promise.all([
        (async () => {
          const q = getSearchQueryByType(type, lastVisible);
          let [snap, posts] = await getPostsByQuery(q);
          posts = combineData(get().posts, posts, type);
          const newLastVisible = setCursor(snap, type);
          if (newLastVisible) lastVisible = newLastVisible;
          return posts;
        })(),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((values) => {
        posts = values[0];
      });
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
