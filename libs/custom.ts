import { FieldValue } from "firebase/firestore";
import { NextRouter } from "next/router";

interface IDefault {
  user: IUser;
}

export const DEFAULT: IDefault = {
  user: {
    id: "",
    email: "",
    displayName: "",
    photoURL:
      "https://res.cloudinary.com/dl5qaj6le/image/upload/v1672976914/archive/static/default_user_photoURL.png",
    txt: "",
    followers: [],
    followings: [],
  },
};

export const SIZE = {
  icon: "32px",
  iconSm: "24px",
  iconXs: "16px",
};

export const COLOR: IDict<string> = {
  "black-f": "#000",
  black: "#111827",
  white: "#fff",
  red: "#ef4444",
  "gray-1f": "#1f2937",
  "gray-1": "#374151",
  "gray-2f": "#6b7280",
  "gray-2": "#9ca3af",
  "gray-3f": "#d1d5db",
  "gray-3": "#e5e7eb",
  "gray-4f": "#f3f4f6",
  "gray-4": "#f9fafb",
};

Object.freeze(DEFAULT);
Object.freeze(SIZE);
Object.freeze(COLOR);

export type IRoute = "feed" | "search" | "add" | "alarm" | "profile" | "post";
export type IType = "user" | "post" | "comment" | "tag" | "like" | "scrap";

export interface IDict<T> {
  [key: string]: T;
}

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  txt: string;
  followers: string[];
  followings: string[];

  likes?: ILike[];
  scraps?: IScrap[];
  history?: string[];
  // posts: string[];
  // tags: string[];

  isLoadedAt?: Date;
}

export interface IPost {
  id?: string;
  uid: string;
  createdAt: Date | FieldValue;
  title: string;
  txt: string;
  imgs: string[];
  color: string;
  tags: string[];

  likes?: ILike[];
  scraps?: IScrap[];
  comments?: IComment[];
  author?: IUser;
  // isDeleted: boolean;
}

export interface IComment {
  id?: string;
  uid: string;
  pid: string;
  createdAt: Date | FieldValue;
  txt: string;

  isLoadedAt?: Date;
}

export interface ITag {
  id?: string;
  pid?: string;
  uid: string;
  name: string;

  post?: IPost;
}

export interface ILike {
  id?: string;
  uid: string;
  pid: string;

  isLoadedAt?: Date;
}

export interface IScrap {
  id?: string;
  uid: string;
  pid: string;
  cont: string;

  isLoadedAt?: Date;
}

export interface IAlarm {
  id: string;
  uid: string;
  photoURL: string;
  targetUid: string;
  targetPid: string;
  targetImg: string;
  targetCid: string;
  targetTxt: string;
  createdAt: Date;
}

export function getRoute(router: NextRouter): IRoute {
  return router.pathname === "/"
    ? "feed"
    : router.pathname === "/search-modal"
    ? "search"
    : (router.pathname.split("/")[1] as IRoute);
}
