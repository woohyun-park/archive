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
import { IUser } from "../libs/custom";

export type IFetchType = "init" | "load" | "refresh";
export const FETCH_LIMIT = {
  post1: 4,
  post2: 8,
  post3: 15,
  alarm: 16,
  comment: 16,
};

export function getFeedQuery(
  type: IFetchType,
  user: IUser,
  lastVisible: QueryDocumentSnapshot<DocumentData>
): Query<DocumentData> {
  const id = user.id;
  if (type === "init")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.post1)
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.post1)
    );
  return query(
    collection(db, "posts"),
    where("uid", "in", [...user.followings, id]),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

export function getFilteredFeedQuery(
  type: IFetchType,
  user: IUser,
  tag: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
): Query<DocumentData> {
  const id = user.id;
  if (type === "init")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.post1)
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.post1)
    );
  return query(
    collection(db, "posts"),
    where("uid", "in", [...user.followings, id]),
    where("tags", "array-contains", tag),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

export function getSearchQueryByType(
  type: IFetchType,
  lastVisible: QueryDocumentSnapshot<DocumentData>
): Query<DocumentData> {
  if (type === "init")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.post3)
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.post3)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

export function getAlarmQuery(
  type: IFetchType,
  uid: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
): Query<DocumentData> {
  if (type === "init")
    return query(
      collection(db, "alarms"),
      where("targetUid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.alarm)
    );
  if (type === "load")
    return query(
      collection(db, "alarms"),
      where("targetUid", "==", uid),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.alarm)
    );
  return query(
    collection(db, "alarms"),
    where("targetUid", "==", uid),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

export function getTagQuery(
  type: IFetchType,
  tag: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
): Query<DocumentData> {
  if (type === "init")
    return query(
      collection(db, "posts"),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.post1)
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.post1)
    );
  return query(
    collection(db, "posts"),
    where("tags", "array-contains", tag),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}
