import { IDict } from "../libs/custom";

export const FETCH_LIMIT = {
  alarm: 16,
  post: { 1: 4, 2: 8, 3: 15 } as IDict<number>,
  scrap: 15,
  tag: 16,
  user: 16,
  comment: 16,
};

export type IFetchType = "init" | "load" | "refresh";

export type IFetchQueryAlarms = {
  type: "uid";
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
    | "uidAndTag";
  value: IDict<any>;
};

export type IFetchQueryScraps = {
  type: "uid";
  value: IDict<any>;
};

export type IFetchQueryTags = {
  type: "keyword" | "uid";
  value: IDict<any>;
};

export type IFetchQueryUsers = {
  type: "keyword";
  value: IDict<any>;
};
