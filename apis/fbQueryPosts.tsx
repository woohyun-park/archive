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
import { IFetchQueryPosts, IFetchType } from "./fbDef";

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
  } else if (fetchQuery.type === "uidAndScrap") {
    return getPostsQueryByUidAndScrap(
      fetchType,
      fetchQuery,
      fetchLimit,
      lastVisible
    );
  } else
    return getPostsQueryAll(fetchType, fetchQuery, fetchLimit, lastVisible);
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
      orderBy("title"),
      startAt(keyword),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "posts"),
      orderBy("title"),
      startAfter(lastVisible),
      endAt(keyword + "\uf8ff"),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    orderBy("title"),
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

function getPostsQueryByUid(
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
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    where("uid", "==", uid),
    endAt(lastVisible)
  );
}

function getPostsQueryByUidAndTag(
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
      startAfter(lastVisible),
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

function getPostsQueryByUidAndScrap(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryPosts,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  const uid = fetchQuery.value.uid;
  const cont = fetchQuery.value.cont;
  if (fetchType === "init")
    return query(
      collection(db, "scraps"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      where("cont", "==", cont),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "scraps"),
      orderBy("createdAt", "desc"),
      where("uid", "==", uid),
      where("cont", "==", cont),
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "scraps"),
    orderBy("createdAt", "desc"),
    where("uid", "==", uid),
    where("cont", "==", cont),
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
