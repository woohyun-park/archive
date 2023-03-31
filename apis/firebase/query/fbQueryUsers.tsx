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
  startAt,
} from "firebase/firestore";
import { IFetchQueryTags, IFetchType } from "../fbDef";
import { db } from "../fb";

export function getUsersQuery(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryTags,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
): Query<DocumentData> {
  return getUsersQueryByKeyword(fetchType, fetchQuery, fetchLimit, lastVisible);
}

function getUsersQueryByKeyword(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryTags,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const keyword = fetchQuery.value.keyword;
  if (fetchType === "init")
    return query(
      collection(db, "users"),
      orderBy("displayName"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "users"),
      orderBy("displayName"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  return query(
    collection(db, "users"),
    orderBy("displayName"),
    startAt(keyword),
    endAt(lastVisible)
  );
}
