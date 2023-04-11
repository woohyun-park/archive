// firebase에 관련된 definition이 저장되어있는 api

import { IDict } from "../def";

export const FETCH_LIMIT = {
  alarms: 16,
  post: 1,
  posts: { 1: 4, 2: 8, 3: 15 } as IDict<number>,
  scraps: 15,
  tags: 16,
  users: 16,
  comments: 16,
};

export type IFetchType = "init" | "load" | "refresh";

export type IFetchQuery =
  | IFetchQueryUsers
  | IFetchQueryPost
  | IFetchQueryPosts
  | IFetchQueryTags
  | IFetchQueryComments
  | IFetchQueryScraps
  | IFetchQueryAlarms;

export type IFetchQueryUsers = {
  type: "keyword";
  value: IDict<any>;
};

export type IFetchQueryPost = {
  type: "pid";
  value: IDict<any>;
};

export type IFetchQueryPosts = {
  type:
    | "none"
    | "follow"
    | "followAndTag"
    | "keyword"
    | "tag"
    | "uid"
    | "uidAndTag"
    | "uidAndScrap";
  readType?: "simple";
  value: IDict<any>;
};

export type IFetchQueryTags = {
  type: "keyword" | "uid";
  value: IDict<any>;
};

export type IFetchQueryComments = {
  type: "pid";
  value: IDict<any>;
};

export type IFetchQueryScraps = {
  type: "uid";
  value: IDict<any>;
};

export type IFetchQueryAlarms = {
  type: "uid";
  value: IDict<any>;
};