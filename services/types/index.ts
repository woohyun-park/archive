import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export type IPageParam = {
  id: string;
  data: any[];
  isFirstPage: boolean;
  prevCursor: QueryDocumentSnapshot<DocumentData> | null;
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
};
