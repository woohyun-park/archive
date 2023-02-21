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
import { db } from "./firebase";
import { IUser } from "../libs/custom";

export type IFetchType = "init" | "load" | "refresh";
export const FETCH_LIMIT = {
  post1: 4,
  post2: 8,
  post3: 15,
  alarm: 16,
  comment: 16,
  user: 16,
  tag: 16,
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

export function getFeedByTagQuery(
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

export function getPostsQuery(
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

export function getPostsByTagQuery(
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

export function getPostsByKeywordQuery(
  type: IFetchType,
  keyword: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
) {
  if (type === "init")
    return query(
      collection(db, "posts"),
      orderBy("title"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(FETCH_LIMIT.post1)
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      orderBy("title"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(FETCH_LIMIT.post1)
    );
  return query(
    collection(db, "posts"),
    orderBy("title"),
    startAt(keyword),
    endAt(lastVisible)
  );
}

export function getTagsQuery(
  type: IFetchType,
  keyword: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
) {
  console.log("getTagsQuery", type, keyword);
  if (type === "init")
    return query(
      collection(db, "tagConts"),
      orderBy("name"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(FETCH_LIMIT.tag)
    );
  if (type === "load")
    return query(
      collection(db, "tagConts"),
      orderBy("name"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(FETCH_LIMIT.tag)
    );
  return query(
    collection(db, "tagConts"),
    orderBy("name"),
    startAt(keyword),
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

export function getUsersByKeywordQuery(
  type: IFetchType,
  keyword: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
) {
  console.log(type);
  if (type === "init")
    return query(
      collection(db, "users"),
      orderBy("displayName"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(FETCH_LIMIT.user)
    );
  if (type === "load")
    return query(
      collection(db, "users"),
      orderBy("displayName"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(FETCH_LIMIT.user)
    );
  return query(
    collection(db, "users"),
    orderBy("displayName"),
    startAt(keyword),
    endAt(lastVisible)
  );
}
