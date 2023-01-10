import { Timestamp } from "firebase/firestore";
import { Style } from "util";

export const DEFAULT = {
  user: {
    photoURL:
      "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
  },
};

export const SIZE = {
  icon: "32px",
  iconSmall: "24px",
};

export const COLOR = {
  txt1: "#000000",
  txt2: "#4A4A4A",
  txt3: "#818181",
  txtDark1: "#FFFFFF",
  txtDark2: "#818181",
  txtDark3: "#4A4A4A",
  txtBtn: "#FFFFFF",
  txtBtnDark: "#000000",
  bg1: "#FFFFFF",
  bgDark1: "#2C2C2C",
  bg2: "#D9D9D9",
  bgDark2: "#D9D9D9",
  btn1: "#000000",
  btnDark1: "#FFFFFF",
  btn2: "#D9D9D9",
  btnDark2: "#D9D9D9",

  red: "#EF4552",
  orange: "#F7892B",
  yellow: "#F7D733",
  green: "#2EB87C",
  blue: "#1BC0DB",
  navy: "#0B4F92",
  purple: "#602E84",
};

Object.freeze(DEFAULT);
Object.freeze(SIZE);
Object.freeze(COLOR);

export const FUNC = {
  filterFalse: function (dict: IDict<boolean>) {
    const newDict: IDict<boolean> = {};
    for (const each in dict) {
      if (dict[each]) {
        newDict[each] = true;
      }
    }
    return newDict;
  },
};

export type IStyle = "post" | "feed" | "search" | "add" | "alarm" | "profile";

export interface IDict<T> {
  [key: string]: T;
}

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  txt: string;
  posts: string[];
  tags: string[];
  likes: string[];
  scraps: string[];
  followers: string[];
  followings: string[];
}

export interface IPost {
  id?: string;
  uid: string;
  createdAt: Date;
  title: string;
  tags: string[];
  txt: string;
  imgs: string[];
  color: string;
  likes: string[];
  scraps: string[];
  comments: string[];
}

export interface IComment {
  id: string;
  user: IUser;
  createdAt: string;
  text: string;
}
