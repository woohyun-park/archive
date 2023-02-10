import { FieldValue } from "firebase/firestore";
import { NextRouter } from "next/router";
const colors = require("tailwindcss/colors");

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
  "black-f": colors.black,
  black: colors.gray[900],
  white: colors.white,
  "gray-1f": colors.gray[800],
  "gray-1": colors.gray[700],
  "gray-2f": colors.gray[500],
  "gray-2": colors.gray[400],
  "gray-3f": colors.gray[300],
  "gray-3": colors.gray[200],
  "gray-4f": colors.gray[100],
  "gray-4": colors.gray[50],
  red: colors.red[500],
  orange: colors.orange[500],
  amber: colors.amber[500],
  yellow: colors.yellow[500],
  lime: colors.lime[500],
  green: colors.green[500],
  emerald: colors.emerald[500],
  teal: colors.teal[500],
  cyan: colors.cyan[500],
  sky: colors.sky[500],
  blue: colors.blue[500],
  indigo: colors.indigo[500],
  violet: colors.violet[500],
  purple: colors.purple[500],
  fuchsia: colors.fuchsia[500],
  pink: colors.pink[500],
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
  aid: string;
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
  aid: string;

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
  id?: string;
  type: "like" | "comment" | "follow";
  uid: string;
  targetUid: string;
  targetPid?: string;
  targetCid?: string;
  createdAt: Date;

  author?: IUser;
  post?: IPost;
  comment?: IComment;
}

export function getRoute(router: NextRouter): IRoute {
  return router.pathname === "/"
    ? "feed"
    : router.pathname === "/search-modal"
    ? "search"
    : (router.pathname.split("/")[1] as IRoute);
}
