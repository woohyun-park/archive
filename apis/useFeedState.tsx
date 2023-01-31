import create from "zustand";
import { devtools } from "zustand/middleware";
import { IComment, IDict, ILike, IPost, IScrap, ITag, IUser } from "../custom";
import {
  collection,
  doc,
  DocumentData,
  endAt,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import { db, getData, getDataByRef, getEach } from "./firebase";
import { POST_PER_PAGE } from "./zustand";

interface IFeedStore {
  posts: IPost[];
  orchestra: number;
  scroll: number;
  getPosts: (id: string, status: IFeedStoreStatus) => Promise<void>;
  setPosts: (posts: IPost[]) => void;
  setOrchestra: (orchestra: number) => void;
  setScroll: (scroll: number) => void;
}

type IFeedStoreStatus = "init" | "load" | "refresh" | "delete";

export let feedFirstVisible: QueryDocumentSnapshot<DocumentData>;
export let feedLastVisible: QueryDocumentSnapshot<DocumentData>;

async function getPostsHelper(
  id: string,
  prevPosts: IPost[],
  status: IFeedStoreStatus
): Promise<IPost[]> {
  const user = await getDataByRef<IUser>(doc(db, "users", id));
  const q =
    status === "init"
      ? query(
          collection(db, "posts"),
          where("uid", "in", [...user.followings, id]),
          orderBy("createdAt", "desc"),
          limit(POST_PER_PAGE.feed.post)
        )
      : status === "load"
      ? query(
          collection(db, "posts"),
          where("uid", "in", [...user.followings, id]),
          orderBy("createdAt", "desc"),
          startAfter(feedLastVisible),
          limit(POST_PER_PAGE.feed.post)
        )
      : status === "refresh"
      ? query(
          collection(db, "posts"),
          where("uid", "in", [...user.followings, id]),
          orderBy("createdAt", "desc"),
          endBefore(feedFirstVisible)
        )
      : status === "delete"
      ? query(
          collection(db, "posts"),
          where("uid", "in", [...user.followings, id]),
          orderBy("createdAt", "desc"),
          startAt(feedFirstVisible),
          endAt(feedLastVisible)
        )
      : null;
  if (!q) return [];
  const snap = await getDocs(q);
  let posts: IPost[] = [];
  for (const doc of snap.docs) {
    const post: IPost = doc.data() as IPost;
    const uid = post.uid;
    const pid = post.id || "";
    const author: IUser = await getData<IUser>("users", uid);
    const likes = await getEach<ILike>("likes", pid);
    const scraps = await getEach<IScrap>("scraps", pid);
    const comments = await getEach<IComment>("comments", pid);
    post.likes = likes ? likes : [];
    post.scraps = scraps ? scraps : [];
    post.comments = comments ? comments : [];
    post.author = author;
    post.createdAt = (post.createdAt as Timestamp).toDate();
    posts.push(post);
  }
  if (status === "init") {
  } else if (status === "load") {
    posts = [...prevPosts, ...posts];
  } else if (status === "refresh") {
    posts = [...posts, ...prevPosts];
  }
  if (snap.docs.length !== 0) {
    if (status === "init") {
      feedFirstVisible = snap.docs[0];
      feedLastVisible = snap.docs[snap.docs.length - 1];
    } else if (status === "load") {
      feedLastVisible = snap.docs[snap.docs.length - 1];
    } else if (status === "refresh") {
      feedFirstVisible = snap.docs[0];
    }
  }
  return posts;
}

const useFeedState = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    orchestra: 0,
    scroll: 0,
    getPosts: async (id: string, status: IFeedStoreStatus) => {
      console.log("getPosts!", id, status);
      let posts: IPost[] = [];
      await Promise.all([
        getPostsHelper(id, get().posts, status),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((values) => {
        posts = values[0];
      });
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    setPosts: (posts: IPost[]) => {
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    setOrchestra: (orchestra: number) => {
      set((state: IFeedStore) => {
        return {
          ...state,
          orchestra,
        };
      });
    },
    setScroll: (scroll: number) => {
      set((state: IFeedStore) => {
        return {
          ...state,
          scroll,
        };
      });
    },
  }))
);

export default useFeedState;
