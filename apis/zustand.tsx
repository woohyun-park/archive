import create from "zustand";
import { IComment, ILike, IPost, IScrap, IUser } from "../custom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  db,
  getData,
  getDataByRef,
  getDatasByQuery,
  getEach,
} from "./firebase";

interface ICurUserState {
  gCurUser: IUser;
  gFeed: {
    posts: IPost[];
    users: IUser[];
  };

  gInit: (id: string) => Promise<void>;
  gSetFeed: (id: string, page: number) => Promise<void>;
  gSetSearch: (type: string, page: number) => Promise<void>;
}

export const useStore = create<ICurUserState>((set, get) => ({
  gCurUser: {
    id: "",
    email: "",
    displayName: "",
    photoURL:
      "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
    txt: "",
    followers: [],
    followings: [],
  },
  gFeed: {
    posts: [],
    users: [],
  },

  gInit: async (id: string) => {
    const loadUser = onSnapshot(doc(db, "users", id), (doc) => {
      set((state) => {
        return {
          ...state,
          gCurUser: {
            ...(doc.data() as IUser),
            likes: state.gCurUser.likes,
            scraps: state.gCurUser.scraps,
          },
        };
      });
    });
    const loadLikes = onSnapshot(
      query(collection(db, "likes"), where("uid", "==", id)),
      (snap) => {
        const datas: ILike[] = [];
        snap.forEach((doc) => {
          datas.push({ ...(doc.data() as ILike) });
        });
        set((state) => {
          return {
            ...state,
            gCurUser: { ...get().gCurUser, likes: datas },
          };
        });
      }
    );
    const loadScraps = onSnapshot(
      query(collection(db, "scraps"), where("uid", "==", id)),
      (snap) => {
        const datas: IScrap[] = [];
        snap.forEach((doc) => {
          datas.push({ ...(doc.data() as IScrap) });
        });
        set((state) => {
          return {
            ...state,
            gCurUser: { ...get().gCurUser, scraps: datas },
          };
        });
      }
    );

    const user = await getDoc(doc(db, "users", id));
    const likes = await getEach<ILike>("likes", id);
    const scraps = await getEach<IScrap>("scraps", id);
    const curUser = {
      ...(user.data() as IUser),
      likes: likes,
      scraps: scraps,
    };
    const posts = await getDatasByQuery<IPost>(
      query(
        collection(db, "posts"),
        where("uid", "in", [...curUser.followings, id]),
        orderBy("createdAt", "desc"),
        limit(5)
      )
    );
    const users: IUser[] = [];

    for await (const post of posts) {
      const pid = post.id;
      const uid = post.uid;
      if (!pid) return;

      const likes = await getEach<ILike>("likes", pid);
      const scraps = await getEach<IScrap>("scraps", pid);
      const comments = await getEach<IComment>("comments", pid);
      const user = await getData<IUser>("users", uid);

      post.likes = likes ? likes : [];
      post.scraps = scraps ? scraps : [];
      post.comments = comments ? comments : [];
      post.author = user;
    }

    set((state) => {
      return {
        ...state,
        gCurUser: curUser,
        gFeed: {
          posts,
        },
      };
    });
  },

  gSetFeed: async (id: string, page: number) => {
    const curUser = await getDataByRef<IUser>(doc(db, "users", id));
    const postSnap = await getDocs(
      query(
        collection(db, "posts"),
        where("uid", "in", [...curUser.followings, curUser.id]),
        orderBy("createdAt", "desc"),
        limit(page * 5)
      )
    );

    const newPosts: IPost[] = [];
    for (const doc of postSnap.docs) {
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
      newPosts.push({
        ...post,
        author,
        createdAt: (post.createdAt as Timestamp).toDate(),
      });
    }
    set((state) => {
      return {
        ...state,
        gFeed: {
          posts: newPosts,
        },
      };
    });
  },

  gSetSearch: async (type: string, page: number) => {
    if (type === "post") {
    } else if (type === "tag") {
    } else if (type === "people") {
    }
  },
}));
