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
import { db, getData, getDataByQuery, getEach } from "./firebase";

interface ICurUserState {
  gCurUser: IUser;
  gPosts: IPost[];
  gUsers: IUser[];

  gInit: Function;

  gSetPostsAndUsers: (
    gCurUser: IUser,
    page: number
  ) => Promise<{ posts: IPost[]; users: IUser[] } | null>;
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
  gPosts: [],
  gUsers: [],

  gInit: async (uid: string) => {
    const loadUser = onSnapshot(doc(db, "users", uid), (doc) => {
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
      query(collection(db, "likes"), where("uid", "==", uid)),
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
      query(collection(db, "scraps"), where("uid", "==", uid)),
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

    const user = await getDoc(doc(db, "users", uid));
    const likes = await getEach<ILike>("likes", user.id);
    const scraps = await getEach<IScrap>("scraps", user.id);
    const curUser = {
      ...(user.data() as IUser),
      likes: likes,
      scraps: scraps,
    };

    const posts = await getDataByQuery<IPost>(
      query(
        collection(db, "posts"),
        where("uid", "in", [...curUser.followings, curUser.id]),
        orderBy("createdAt", "desc"),
        limit(5)
      )
    );
    const users: IUser[] = [];
    for await (const post of posts) {
      const likes = await getEach<ILike>("likes", post.id || "");
      const scraps = await getEach<IScrap>("scraps", post.id || "");
      const comments = await getEach<IComment>("comments", post.id || "");
      post.likes = likes ? likes : [];
      post.scraps = scraps ? scraps : [];
      post.comments = comments ? comments : [];
      const user = await getData<IUser>("users", post.uid);
      users.push(user);
    }

    set((state) => {
      return {
        ...state,
        gCurUser: curUser,
        gPosts: posts,
        gUsers: users,
      };
    });
  },

  gSetPostsAndUsers: async (gCurUser: IUser, page: number) => {
    const q = query(
      collection(db, "posts"),
      where("uid", "in", [...gCurUser.followings, gCurUser.id]),
      orderBy("createdAt", "desc"),
      limit(page * 5)
    );
    const postSnap = await getDocs(q);
    const newPosts: IPost[] = [];
    const uids: string[] = [];
    postSnap.forEach((doc) => {
      const data: IPost = doc.data() as IPost;
      newPosts.push({
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as IPost);
      uids.push(data.uid);
    });
    for await (const post of newPosts) {
      const likes = await getEach<ILike>("likes", post.id || "");
      const scraps = await getEach<IScrap>("scraps", post.id || "");
      const comments = await getEach<IComment>("comments", post.id || "");
      post.likes = likes ? likes : [];
      post.scraps = scraps ? scraps : [];
      post.comments = comments ? comments : [];
    }
    const newUsers: IUser[] = [];
    for await (const uid of uids) {
      const user = await getData<IUser>("users", uid);
      newUsers.push(user);
    }
    set((state) => {
      return {
        ...state,
        gPosts: newPosts,
        gUsers: newUsers,
      };
    });
    return {
      posts: newPosts,
      users: newUsers,
    };
  },
}));
