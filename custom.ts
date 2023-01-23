import { FieldValue, Timestamp } from "firebase/firestore";
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
  iconSmall: "24px",
};

export const COLOR: IDict<string> = {
  black: "#000",
  white: "#fff",
  "gray-1": "#374151",
  "gray-2": "#9ca3af",
  "gray-3": "#e5e7eb",
  "gray-4": "#f3f4f6",

  red: "#ef4444",
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

export function getRoute(router: NextRouter): IRoute {
  return router.pathname === "/"
    ? "feed"
    : router.pathname === "/search-modal"
    ? "search"
    : (router.pathname.split("/")[1] as IRoute);
}
