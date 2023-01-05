import create from "zustand";
import { IUser } from "../custom";

interface IUserState {
  user: IUser;
  setUser: (user: IUser) => void;
}

export const useStore = create<IUserState>((set) => ({
  user: { uid: "", displayName: "", photoURL: "" },
  setUser: (user) =>
    set((state) => {
      return { ...state, user };
    }),
}));
