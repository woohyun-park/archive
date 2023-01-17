import create from "zustand";
import { IComment, IDict, ILike, IPost, IScrap, IUser } from "../custom";
import {
  collection,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, getData, getDataByQuery } from "./firebase";

interface ICurUserState {
  gCurUser: IUser;
  gSetCurUser: (gCurUser: IDict<any>) => Promise<IUser>;
  gPosts: IPost[];
  gUsers: IUser[];
  gSetPostsAndUsers: (
    gCurUser: IUser,
    page: number
  ) => Promise<{ posts: IPost[]; users: IUser[] } | null>;
}

export const useStore = create<ICurUserState>((set) => ({
  gCurUser: {
    id: "",
    email: "",
    displayName: "",
    photoURL: "",
    txt: "",
    followers: [],
    followings: [],
  },
  gSetCurUser: async (gCurUser: IDict<any>) => {
    await updateDoc(doc(db, "users", gCurUser.id), {
      ...gCurUser,
    });
    const snap = await getDoc(doc(db, "users", gCurUser.id));
    const likes = await getDataByQuery<ILike>(
      "likes",
      "uid",
      "==",
      gCurUser.id
    );
    const scraps = await getDataByQuery<IScrap>(
      "scraps",
      "uid",
      "==",
      gCurUser.id
    );
    set((state) => {
      return {
        ...state,
        gCurUser: {
          ...(snap.data() as IUser),
          likes: likes,
          scraps: scraps,
        },
      };
    });
    return {
      ...(snap.data() as IUser),
      likes: likes,
      scraps: scraps,
    };
  },
  gPosts: [],
  gUsers: [],
  gSetPostsAndUsers: async (gCurUser: IUser, page: number) => {
    if (gCurUser.followings.length === 0) {
      return null;
    }
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
        createdAt: data.createdAt,
      } as IPost);
      uids.push(data.uid);
    });
    for await (const post of newPosts) {
      const likes = await getDataByQuery<ILike>(
        "likes",
        "pid",
        "==",
        post.id || ""
      );
      const scraps = await getDataByQuery<IScrap>(
        "scraps",
        "pid",
        "==",
        post.id || ""
      );
      const comments = await getDataByQuery<IComment>(
        "comments",
        "pid",
        "==",
        post.id || ""
      );
      if (likes) {
        post.likes = likes;
      } else {
        post.likes = [];
      }
      if (scraps) {
        post.scraps = scraps;
      } else {
        post.scraps = [];
      }
      if (comments) {
        post.comments = comments;
      } else {
        post.comments = [];
      }
    }
    const newUsers: IUser[] = [];
    for await (const uid of uids) {
      const user = await getData<IUser>("users", uid);
      newUsers.push(user);
    }
    set((state) => {
      return {
        ...state,
        gPosts: [...newPosts],
        gUsers: [...newUsers],
      };
    });
    return {
      posts: [...newPosts],
      users: [...newUsers],
    };
  },
}));
