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
import {
  FETCH_LIMIT,
  IFetchQueryPosts,
  IFetchQueryTags,
  IFetchType,
} from "../stores/useCache";
import { StringMappingType } from "typescript";

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
      limit(FETCH_LIMIT.post[1])
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.post[1])
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
      limit(FETCH_LIMIT.post[1])
    );
  if (type === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(FETCH_LIMIT.post[1])
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
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
): Query<DocumentData> {
  if (fetchQuery.type === "follow")
    return getPostsQueryByFollow(
      fetchType,
      fetchQuery,
      fetchLimit,
      lastVisible
    );
  else if (fetchQuery.type === "followAndTag")
    return getPostsQueryByFollowAndTag(
      fetchType,
      fetchQuery,
      fetchLimit,
      lastVisible
    );
  else if (fetchQuery.type === "keyword")
    return getPostsQueryByKeyword(
      fetchType,
      fetchQuery,
      fetchLimit,
      lastVisible
    );
  else if (fetchQuery.type === "tag")
    return getPostsQueryByTag(fetchType, fetchQuery, fetchLimit, lastVisible);
  else if (fetchQuery.type === "uid") {
    return getPostsQueryByUid(fetchType, fetchQuery, fetchLimit, lastVisible);
  } else if (fetchQuery.type === "uidAndTag") {
    return getPostsQueryByUidAndTag(
      fetchType,
      fetchQuery,
      fetchLimit,
      lastVisible
    );
  } else
    return getPostsQueryAll(fetchType, fetchQuery, fetchLimit, lastVisible);
}

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

export function getScrapsQuery(
  type: IFetchType,
  uid: string,
  lastVisible: QueryDocumentSnapshot<DocumentData>
) {
  if (type === "init")
    return query(
      collection(db, "scraps"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.scrap)
    );
  if (type === "load")
    return query(
      collection(db, "scraps"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(FETCH_LIMIT.scrap)
    );
  return query(
    collection(db, "scraps"),
    where("uid", "==", uid),
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

export function getPostsQueryByUid(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const uid = fetchQuery.value.uid;
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    where("uid", "==", uid),
    endAt(lastVisible)
  );
}

export function getPostsQueryByUidAndTag(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const uid = fetchQuery.value.uid;
  const tag = fetchQuery.value.tag;
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      where("tags", "array-contains", tag),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      where("tags", "array-contains", tag),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    where("uid", "==", uid),
    where("tags", "array-contains", tag),
    endAt(lastVisible)
  );
}

function getPostsQueryByFollowAndTag(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const follow = fetchQuery.value.follow;
  const tag = fetchQuery.value.tag;
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      where("uid", "in", follow),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", follow),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    where("uid", "in", follow),
    where("tags", "array-contains", tag),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

function getPostsQueryByFollow(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const follow = fetchQuery.value.follow;
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      where("uid", "in", follow),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", follow),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    where("uid", "in", follow),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

function getPostsQueryByKeyword(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const keyword = fetchQuery.value.keyword;
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    startAt(keyword),
    endAt(lastVisible)
  );
}

function getPostsQueryByTag(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const tag = fetchQuery.value.tag;
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      where("tags", "array-contains", tag),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    where("tags", "array-contains", tag),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}

function getPostsQueryAll(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  if (fetchType === "init")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}
