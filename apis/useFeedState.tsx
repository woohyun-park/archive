import create from "zustand";
import { devtools } from "zustand/middleware";
import { IComment, IDict, ILike, IPost, IScrap, ITag, IUser } from "../custom";
import {
  collection,
  doc,
  DocumentData,
  endBefore,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { db, getData, getDataByRef, getEach } from "./firebase";
import { POST_PER_PAGE } from "./zustand";

interface IFeedStore {
  posts: IPost[];
  orchestra: number;
  scroll: number;
  setPosts: (id: string, status: IFeedStoreStatus) => Promise<void>;
  setOrchestra: (orchestra: number) => void;
  setScroll: (scroll: number) => void;

  test: number;
}

type IFeedStoreStatus = "init" | "load" | "refresh";

let feedFirstVisible: QueryDocumentSnapshot<DocumentData>;
let feedLastVisible: QueryDocumentSnapshot<DocumentData>;

async function getFeed(
  id: string,
  status: "init" | "load" | "refresh"
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
      : "";
  const snap = await getDocs(
    query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      limit(POST_PER_PAGE.feed.post)
    )
  );
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
    setPosts: async (id: string, status: IFeedStoreStatus) => {
      console.log("setPosts!", id, status);
      let posts: IPost[] = [];
      await Promise.all([
        getFeed(id, status),
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
          test: state.test + 1,
          posts: [...posts, ...state.posts],
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

    test: 0,
  }))
);

export default useFeedState;
