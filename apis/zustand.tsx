import create from "zustand";
import { IUser, IDict } from "../custom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

interface IUserState {
  curUser: IUser;
  setCurUser: (user: IUser) => void;
  updateCurUser: (user: IUser) => void;
}

export const useStore = create<IUserState>((set) => ({
  curUser: {
    uid: "",
    displayName: "",
    photoURL: "",
    txt: "",
    posts: [],
    tags: [],
    scraps: [],
    followers: {},
    followings: {},
  },
  setCurUser: async (curUser) => {
    const userRef = doc(db, "users", curUser.uid);
    set((state) => {
      return { ...state, curUser };
    });
  },
  updateCurUser: async (newCurUser: IUser) => {
    const userRef = doc(db, "users", newCurUser.uid);
    await updateDoc(userRef, {
      ...newCurUser,
    });
  },
}));
