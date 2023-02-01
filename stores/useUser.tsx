import create from "zustand";
import { devtools } from "zustand/middleware";
import { ILike, IScrap, IUser } from "../libs/custom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, getEach } from "../apis/firebase";

interface IState {
  curUser: IUser;
  getCurUser: (id: string) => void;
}

export const useStore = create<IState>()(
  devtools((set, get) => ({
    curUser: {
      id: "",
      email: "",
      displayName: "",
      photoURL:
        "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
      txt: "",
      followers: [],
      followings: [],
    },
    getCurUser: async (id: string) => {
      const user = await getDoc(doc(db, "users", id));
      const likes = await getEach<ILike>("likes", id);
      const scraps = await getEach<IScrap>("scraps", id);
      const curUser = {
        ...(user.data() as IUser),
        likes,
        scraps,
      };
      onSnapshot(doc(db, "users", id), (doc) => {
        set((state: IState) => {
          return {
            ...state,
            curUser: {
              ...(doc.data() as IUser),
              likes: state.curUser.likes,
              scraps: state.curUser.scraps,
            },
          };
        });
      });
      set((state: IState) => {
        return {
          ...state,
          curUser,
        };
      });
    },
  }))
);
