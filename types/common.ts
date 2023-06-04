import { FieldValue } from "firebase/firestore";

export type IData = IUser | IPost | ITag | ILike | IComment | IScrap | IAlarm;

export type ICollectionType =
  | "users"
  | "posts"
  | "tags"
  | "likes"
  | "comments"
  | "scraps"
  | "alarms";

export type IDataType = IUser | IPost | ITag | ILike | IComment | IScrap | IAlarm;

export type IPageType = "add" | "alarm" | "feed" | "post" | "profile" | "search";

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

export type IIcon =
  | "alarm"
  | "back"
  | "comment"
  | "delete"
  | "down"
  | "filter"
  | "like"
  | "modify"
  | "refresh"
  | "scrap"
  | "search"
  | "setting"
  | "up"
  | "x";
