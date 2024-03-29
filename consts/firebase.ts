import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

import { IDict } from "apis/def";

export const FETCH_LIMIT = {
  alarms: 16,
  post: 1,
  posts: { 1: 4, 2: 8, 3: 15 },
  postsCol1: 4,
  postsCol2: 8,
  postsCol3: 15,
  scraps: 15,
  tags: 16,
  users: 16,
  comments: 16,
};

export type IField = { id: string } & IDict<any>;

export type IPageParam = {
  id: string;
  data: any[];
  isFirstPage: boolean;
  prevCursor: QueryDocumentSnapshot<DocumentData> | null;
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
};
