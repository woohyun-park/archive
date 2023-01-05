import create from "zustand";
import { IUser } from "../custom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

interface IUserState {
  user: IUser;
  setUser: (user: IUser) => void;
}

export const useStore = create<IUserState>((set) => ({
  user: {
    uid: "",
    displayName: "",
    photoURL: "",
    posts: [],
    tags: [],
    scraps: [],
    followers: [],
    followings: [],
  },
  setUser: async (user) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      ...user,
    });
    set((state) => {
      return { ...state, user };
    });
  },
}));
