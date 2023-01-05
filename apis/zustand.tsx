import create from "zustand";
import { IUser } from "../custom";

interface IUserState {
  userState: IUser;
  setUserState: (userState: IUser) => void;
}

export const useStore = create<IUserState>((set) => ({
  userState: { uid: "", displayName: "", photoURL: "" },
  setUserState: (userState) =>
    set((state) => {
      return { ...state, userState };
    }),
}));
