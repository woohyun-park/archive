import create from "zustand";
import { ILike, IScrap, IUser } from "../custom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, getDataByQuery } from "./firebase";

interface IUserState {
  curUser: IUser;
  setCurUser: (user: IUser) => void;
  updateCurUser: (user: IUser) => void;
  refreshCurUser: (uid: string) => void;
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
  refreshCurUser: async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid));
    const likes = await getDataByQuery("likes", "uid", "==", uid);
    const scraps = await getDataByQuery("scraps", "uid", "==", uid);
    set((state) => {
      return {
        ...state,
        curUser: {
          ...(snap.data() as IUser),
          likes: likes as ILike[],
          scraps: scraps as IScrap[],
        },
      };
    });
  },
}));
