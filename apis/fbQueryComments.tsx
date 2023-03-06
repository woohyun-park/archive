import {
  collection,
  DocumentData,
  endAt,
  limit,
  orderBy,
  query,
  Query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { IFetchQueryAlarms, IFetchQueryComments, IFetchType } from "./fbDef";

export function getCommentsQuery(
  fetchQuery: IFetchQueryComments
): Query<DocumentData> {
  return query(
    collection(db, "comments"),
    where("pid", "==", fetchQuery.value.pid)
  );
}
