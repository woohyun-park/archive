// 전역적으로 사용되는 interface가 저장되어있는 api

import { FieldValue } from "firebase/firestore";

export type IData = IUser | IPost | ITag | IAlarm | ILike | IComment | IScrap;

export type IDataType =
  | "users"
  | "posts"
  | "tags"
  | "alarms"
  | "likes"
  | "comments"
  | "scraps";

export type IPageType =
  | "feed"
  | "search"
  | "add"
  | "alarm"
  | "profile"
  | "post";

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
  createdAt: Date | FieldValue;

  likes?: ILike[];
  scraps?: IScrap[];
  history?: string[];
  alarms?: IAlarm[];
  tags?: string[];
}

export interface IPost {
  id: string;
  uid: string;
  title: string;
  txt: string;
  imgs: string[];
  color: string;
  tags: string[];
  createdAt: Date | FieldValue;

  likes?: ILike[];
  scraps?: IScrap[];
  comments?: IComment[];
  author?: IUser;
}

export interface IComment {
  id: string;
  uid: string;
  pid: string;
  aid?: string;
  txt: string;
  createdAt: Date | FieldValue;
}

export interface ITag {
  id: string;
  pid?: string;
  uid: string;
  name: string;
  createdAt: Date | FieldValue;

  post?: IPost;
}

export interface ILike {
  id: string;
  uid: string;
  pid: string;
  aid?: string;
  createdAt: Date | FieldValue;
}

export interface IScrap {
  id: string;
  uid: string;
  pid: string;
  cont: string;
  createdAt: Date | FieldValue;
}

export interface IAlarm {
  id: string;
  type: "like" | "comment" | "follow";
  uid: string;
  targetUid: string;
  pid?: string;
  cid?: string;
  createdAt: Date | FieldValue;
  isViewed: boolean;

  author?: IUser;
  post?: IPost;
  comment?: IComment;
}
