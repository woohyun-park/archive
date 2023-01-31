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
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  startAt,
  Timestamp,
  where,
} from "firebase/firestore";
import { db, getData, getDataByRef, getEach } from "./firebase";
import { POST_PER_PAGE } from "./zustand";

interface IFeedStore {
  posts: IPost[];
  orchestra: Set<string>;
  scroll: number;
  hidden: Set<string>;

  getPosts: (id: string, type: IFeedGetType) => Promise<void>;

  setPosts: (posts: IPost[]) => void;
  setOrchestra: (posts: IPost[]) => void;
  setHidden: (pid: string) => void;
  setScroll: (scroll: number) => void;
}

type IFeedGetType = "init" | "load" | "refresh";

export let feedFirstVisible: QueryDocumentSnapshot<DocumentData>;
export let feedLastVisible: QueryDocumentSnapshot<DocumentData>;

function getQueryByType(user: IUser, type: IFeedGetType): Query<DocumentData> {
  const id = user.id;
  if (type === "init")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      limit(POST_PER_PAGE.feed.post)
    );
  else if (type === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      startAfter(feedLastVisible),
      limit(POST_PER_PAGE.feed.post)
    );
  else
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      endAt(feedLastVisible)
    );
}

async function getPostsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IPost[]]> {
  const snap = await getDocs(q);
  const posts: IPost[] = [];
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
  return [snap, posts];
}

function combinePrevAndNewPosts(
  prevPosts: IPost[],
  posts: IPost[],
  type: IFeedGetType
) {
  if (type === "init") return [...posts];
  else if (type === "load") return [...prevPosts, ...posts];
  else return [...posts];
}

function setCursorByType(
  snap: QuerySnapshot<DocumentData>,
  type: IFeedGetType
) {
  if (snap.docs.length !== 0) {
    if (type === "init") {
      feedFirstVisible = snap.docs[0];
      feedLastVisible = snap.docs[snap.docs.length - 1];
    } else if (type === "load") {
      feedLastVisible = snap.docs[snap.docs.length - 1];
    } else if (type === "refresh") {
      feedFirstVisible = snap.docs[0];
      feedLastVisible = snap.docs[snap.docs.length - 1];
    }
  }
}

async function getPostsHelper(
  id: string,
  prevPosts: IPost[],
  type: IFeedGetType
): Promise<IPost[]> {
  const user = await getDataByRef<IUser>(doc(db, "users", id));
  const q = getQueryByType(user, type);
  let [snap, posts] = await getPostsByQuery(q);
  posts = combinePrevAndNewPosts(prevPosts, posts, type);
  setCursorByType(snap, type);
  return posts;
}

export const feedStore = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    orchestra: new Set<string>(),
    hidden: new Set<string>(),
    scroll: 0,
    getPosts: async (id: string, type: IFeedGetType) => {
      console.log("getPosts!", id, type);
      let posts: IPost[] = [];
      await Promise.all([
        getPostsHelper(id, get().posts, type),
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
    setOrchestra: (posts: IPost[]) => {
      const orchestra = new Set<string>();
      for (const post of posts) {
        const id = post.id || "";
        orchestra.add(id);
      }
      set((state: IFeedStore) => {
        return {
          ...state,
          orchestra,
        };
      });
    },
    setHidden: (pid: string) => {
      const hidden = get().hidden;
      hidden.add(pid);
      set((state: IFeedStore) => {
        return {
          ...state,
          hidden,
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
