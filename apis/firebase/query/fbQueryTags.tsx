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
  where,
} from "firebase/firestore";
import { db } from "../fb";
import { IFetchQueryTags, IFetchType } from "../fbDef";

export function getTagsQuery(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryTags,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
): Query<DocumentData> {
  if (fetchQuery.type === "keyword")
    return getTagsQueryByKeyword(
      fetchType,
      fetchQuery,
      fetchLimit,
      lastVisible
    );
  // (fetchQuery.type === "uid")
  return getTagsQueryByUid(fetchType, fetchQuery, fetchLimit, lastVisible);
}

function getTagsQueryByKeyword(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryTags,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const keyword = fetchQuery.value.keyword;
  if (fetchType === "init")
    return query(
      collection(db, "tagConts"),
      orderBy("name"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "tagConts"),
      orderBy("name"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  return query(
    collection(db, "tagConts"),
    orderBy("name"),
    startAt(keyword),
    endAt(lastVisible)
  );
}

function getTagsQueryByUid(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryTags,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const uid = fetchQuery.value.uid;
  if (fetchType === "init")
    return query(
      collection(db, "tags"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "tags"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      where("uid", "==", uid),
      limit(fetchLimit)
    );
  return query(
    collection(db, "tags"),
    orderBy("createdAt", "desc"),
    where("uid", "==", uid),
    endAt(lastVisible)
  );
}
