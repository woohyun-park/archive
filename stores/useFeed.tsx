import {
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { IPost, IUser } from "../libs/custom";
import {
  getFeedQuery,
  getFilteredFeedQuery,
  IFetchType,
} from "../apis/fbQuery";
import { combineData, setCursor, wrapPromise } from "./libStores";
import { readData, readPost } from "../apis/fbRead";

interface IFeedStore {
  posts: IPost[];
  filteredPosts: IPost[];
  refresh: boolean;
  isLast: boolean;
  getPosts: (type: IFetchType, id: string) => Promise<IPost[]>;
  getFilteredPosts: (
    type: IFetchType,
    id: string,
    tag: string
  ) => Promise<IPost[]>;
  setPosts: (posts: IPost[]) => void;
  setFilteredPosts: (filteredPosts: IPost[]) => void;
  setRefresh: (refresh: boolean) => void;
}

let lastVisible: QueryDocumentSnapshot<DocumentData>;
let lastFilteredVisible: QueryDocumentSnapshot<DocumentData>;

async function getPostsHelper(
  id: string,
  type: IFetchType,
  prevPosts: IPost[],
  tag?: string
) {
  return await wrapPromise(async () => {
    const user = await readData<IUser>("users", id);
    const q = tag
      ? getFilteredFeedQuery(type, user, tag, lastFilteredVisible)
      : getFeedQuery(type, user, lastVisible);
    const snap = await getDocs(q);
    const resPosts: IPost[] = [];
    for (const doc of snap.docs) {
      const post = await readPost(doc.data().id);
      resPosts.push(post);
    }
    const posts = combineData(prevPosts, resPosts, type);
    const newLastVisible = setCursor(snap, type);
    if (newLastVisible)
      tag
        ? (lastFilteredVisible = newLastVisible)
        : (lastVisible = newLastVisible);
    return tag ? { filteredPosts: posts } : { posts };
  }, 1000);
}

export const useFeed = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    filteredPosts: [] as IPost[],
    refresh: false,
    isLast: false,
    getPosts: async (type: IFetchType, id: string) => {
      const { posts } = await getPostsHelper(id, type, get().posts);
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
      return posts;
    },
    getFilteredPosts: async (type: IFetchType, id: string, tag: string) => {
      const { filteredPosts } = await getPostsHelper(
        id,
        type,
        get().filteredPosts,
        tag
      );
      set((state: IFeedStore) => {
        return {
          ...state,
          filteredPosts,
        };
      });
      return filteredPosts;
    },
    setPosts: (posts: IPost[]) => {
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    setFilteredPosts: (filteredPosts: IPost[]) => {
      set((state: IFeedStore) => {
        return { ...state, filteredPosts };
      });
    },
    setRefresh: (refresh: boolean) => {
      set((state: IFeedStore) => {
        return { ...state, refresh };
      });
    },
  }))
);
