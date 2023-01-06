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
    txt: "",
    posts: [],
    tags: [],
    scraps: [],
    followers: [],
    followings: [],
  },
  setUser: async (user) => {
    const userRef = doc(db, "users", user.uid);
    set((state) => {
      return { ...state, user };
    });
  },
  updateUser: async (newUser: IUser) => {
    const userRef = doc(db, "users", newUser.uid);
    await updateDoc(userRef, {
      ...newUser,
    });
  },
}));
