import create from "zustand";
import { IUser } from "../custom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

interface IUserState {
  curUser: IUser;
  setCurUser: (user: IUser) => void;
  updateCurUser: (user: IUser) => void;
}

export const useStore = create<IUserState>((set) => ({
  curUser: {
    id: "",
    email: "",
    displayName: "",
    photoURL: "",
    txt: "",
    followers: [],
    followings: [],
  },
  setCurUser: async (curUser) => {
    set((state) => {
      return { ...state, curUser };
    });
  },
  updateCurUser: async (newCurUser: IUser) => {
    const userRef = doc(db, "users", newCurUser.id);
    await updateDoc(userRef, {
      ...newCurUser,
    });
  },
}));
