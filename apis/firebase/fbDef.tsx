// firebase에 관련된 definition이 저장되어있는 api

import { IDict } from "../def";

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
