import {
  collection,
  DocumentData,
  endAt,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { db } from "../apis/firebase";
import { IPost, ITag, IUser } from "../libs/custom";
import {
  combinePrevAndNewPosts,
  getPostsByQuery,
  setCursorByType,
} from "./useFeedHelper";

interface ISearchStore {
  posts: IPost[];
  getPosts: (type: ISearchGetType) => Promise<void>;

  tags: ITag[];
  users: IUser[];
}

type ISearchGetType = "init" | "load" | "refresh";

const LIMIT = {
  posts: 18,
};

let searchLastVisible: QueryDocumentSnapshot<DocumentData>;

function getQueryByType(type: ISearchGetType): Query<DocumentData> {
  if (type === "init")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(LIMIT.posts)
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(searchLastVisible),
      limit(LIMIT.posts)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    endAt(searchLastVisible)
  );
}

export const useSearch = create<ISearchStore>()(
  devtools((set, get) => ({
    posts: [],
    getPosts: async (type: ISearchGetType) => {
      let posts: IPost[] = [];
      await Promise.all([
        (async () => {
          const q = getQueryByType(type);
          let [snap, posts] = await getPostsByQuery(q);
          posts = combinePrevAndNewPosts(get().posts, posts, type);
          const lastVisible = setCursorByType(snap, type);
          if (lastVisible) searchLastVisible = lastVisible;
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
