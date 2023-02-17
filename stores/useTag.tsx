import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { getPostsByQuery } from "../apis/firebase";
import { IDict, IPost } from "../libs/custom";
import { getTagQuery, IFetchType } from "../libs/queryLib";
import { combineData, setCursor } from "./libStores";

interface IUseTag {
  dictPosts: IDict<IPost[]>;
  getPosts: (type: IFetchType, tag: string) => Promise<void>;
}

const dictLastVisible: IDict<QueryDocumentSnapshot<DocumentData>> = {};

export const useTag = create<IUseTag>()(
  devtools((set, get) => ({
    dictPosts: {},
    getPosts: async (type: IFetchType, tag: string) => {
      let posts: IPost[] = [];
      await Promise.all([
        (async () => {
          const q = getTagQuery(type, tag, dictLastVisible[tag]);
          let [snap, posts] = await getPostsByQuery(q);
          posts = combineData(get().dictPosts[tag], posts, type);
          const newLastVisible = setCursor(snap, type);
          if (newLastVisible) dictLastVisible[tag] = newLastVisible;
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
      set((state: IUseTag) => {
        state.dictPosts[tag] = posts;
        return {
          ...state,
        };
      });
    },
  }))
);
