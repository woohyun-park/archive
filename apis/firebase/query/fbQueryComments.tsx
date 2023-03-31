import {
  collection,
  DocumentData,
  query,
  Query,
  where,
} from "firebase/firestore";
import { db } from "../fb";
import { IFetchQueryComments } from "../fbDef";

export function getCommentsQuery(
  fetchQuery: IFetchQueryComments
): Query<DocumentData> {
  return query(
    collection(db, "comments"),
    where("pid", "==", fetchQuery.value.pid)
  );
}
