import create from "zustand";
import { IDict, ILike, IScrap, IUser } from "../custom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, getDataByQuery } from "./firebase";

interface ICurUserState {
  curUser: IUser;
  setCurUser: (user: IDict<any>) => void;
}

export const useStore = create<ICurUserState>((set) => ({
  curUser: {
    id: "",
    email: "",
    displayName: "",
    photoURL: "",
    txt: "",
    followers: [],
    followings: [],
  },
  setCurUser: async (user: IDict<any>) => {
    await updateDoc(doc(db, "users", user.id), {
      ...user,
    });
    const snap = await getDoc(doc(db, "users", user.id));
    const likes = await getDataByQuery<ILike>("likes", "uid", "==", user.id);
    const scraps = await getDataByQuery<IScrap>("scraps", "uid", "==", user.id);
    set((state) => {
      return {
        ...state,
        curUser: {
          ...(snap.data() as IUser),
          likes: likes,
          scraps: scraps,
        },
      };
    });
  },
}));
