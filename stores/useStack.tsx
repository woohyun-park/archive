import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IDict, IPost, IUser } from "../libs/custom";

type IStack = "home" | "profile" | "search";
interface IUseStack {
  stack: IStack;
  cachedPosts: IDict<IPost>;

  setStack: (stack: IStack) => void;
  setCachedPosts: (posts: IDict<IPost>) => void;

  stackProfile: IDict<any>[];
  pushStackProfile: (data: IDict<any>) => void;
  popStackProfile: () => IDict<any> | undefined;
}

export const useStack = create<IUseStack>()(
  devtools((set, get) => ({
    stack: "home",
    cachedPosts: {},
    stackProfile: [],

    setStack: (stack: IStack) => {
      set((state: IUseStack) => {
        return {
          ...state,
          stack,
        };
      });
    },
    setCachedPosts: (posts: IDict<IPost>) => {
      set((state: IUseStack) => {
        return {
          ...state,
          cachedPosts: { ...state.cachedPosts, ...posts },
        };
      });
    },
    pushStackProfile: (data: IDict<any>) => {
      set((state: IUseStack) => {
        const stackProfile: IDict<any>[] = [...state.stackProfile];
        stackProfile.push(data);
        return {
          ...state,
          stackProfile,
        };
      });
    },
    popStackProfile: () => {
      let result: IDict<any> | undefined;
      set((state: IUseStack) => {
        const stackProfile: IDict<any>[] = [...state.stackProfile];
        result = stackProfile.pop();
        return {
          ...state,
          stackProfile,
        };
      });
      return result;
    },
  }))
);
