import create from "zustand";
import { devtools } from "zustand/middleware";
import { IComment, IDict, ILike, IPost, IScrap, IUser } from "../custom";
import {
  collection,
  doc,
  DocumentData,
  endBefore,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { db, getData, getDataByRef, getEach } from "./firebase";
import { POST_PER_PAGE } from "./zustand";

interface IFeedStore {
  posts: IPost[];
  animate: IDict<boolean>;
  scroll: number;

  getPosts: (id: string, status: IFeedGetType) => Promise<void>;
  getAnimate: (posts: IPost[]) => IDict<boolean>;

  setPosts: (posts: IPost[]) => void;
  setAnimate: (animate: IDict<boolean>) => void;
  setScroll: (scroll: number) => void;
}

type IFeedGetType = "init" | "load" | "refresh";

let feedFirstVisible: QueryDocumentSnapshot<DocumentData>;
let feedLastVisible: QueryDocumentSnapshot<DocumentData>;

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
      endBefore(feedFirstVisible)
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

function calculateNewPosts(
  prevPosts: IPost[],
  posts: IPost[],
  type: IFeedGetType
) {
  if (type === "init") return [...posts];
  else if (type === "load") return [...prevPosts, ...posts];
  else return [...posts, ...prevPosts];
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
  const [snap, posts] = await getPostsByQuery(q);
  setCursorByType(snap, type);
  return calculateNewPosts(prevPosts, posts, type);
}

async function setMinTimeout() {
  return;
}

const useFeedState = create<IFeedStore>()(
  devtools((set, get) => ({
    posts: [] as IPost[],
    animate: {},
    scroll: 0,
    getPosts: async (id: string, type: IFeedGetType) => {
      console.log("getPosts", id, type);
      let posts: IPost[] = [];
      let animate: IDict<boolean> = {};
      await Promise.all([
        getPostsHelper(id, get().posts, type),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(0);
          }, 1000);
        }),
      ]).then((values) => {
        const [resPosts, resTimeout] = values;
        posts = resPosts;
        animate = get().getAnimate(posts);
      });
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
          animate,
        };
      });
    },
    setPosts: (posts: IPost[]) => {
      console.log("setPosts", posts);
      set((state: IFeedStore) => {
        return {
          ...state,
          posts,
        };
      });
    },
    getAnimate: (posts: IPost[]) => {
      const animate = get().animate;
      for (const post of posts) {
        const pid = post?.id || "";
        animate[pid] = animate[pid] === undefined ? true : false;
      }
      return animate;
    },
    setAnimate: (animate: IDict<boolean>) => {
      console.log("setAnimate");
      set((state: IFeedStore) => {
        return {
          ...state,
          animate,
        };
      });
    },
    setScroll: (scroll: number) => {
      console.log("setScroll", scroll);
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
