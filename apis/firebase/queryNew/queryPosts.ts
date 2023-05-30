import { FETCH_LIMIT, IPageParam } from "consts/firebase";
import {
  collection,
  endAt,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";

import { db } from "../fb";

export function getPostsQuery() {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT.postsCol3)
      ),
      load: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refresh: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}

export function getPostsQueryByFollowings(followings: string[]) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT.postsCol1)
      ),
      load: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.postsCol1)
      ),
      refresh: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "posts"),
        where("uid", "in", followings),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}

export function getPostsQueryByKeyword(keyword: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "posts"),
        orderBy("title"),
        startAt(keyword),
        endAt(keyword + "\uf8ff"),
        limit(FETCH_LIMIT.postsCol3)
      ),
      load: query(
        collection(db, "posts"),
        orderBy("title"),
        startAfter(pageParams.nextCursor),
        endAt(keyword + "\uf8ff"),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refresh: query(
        collection(db, "posts"),
        orderBy("title"),
        startAt(keyword),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "posts"),
        orderBy("title"),
        startAt(keyword),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}

export function getPostsQueryByTag(tag: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "posts"),
        where("tags", "array-contains", tag),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT.postsCol3)
      ),
      load: query(
        collection(db, "posts"),
        where("tags", "array-contains", tag),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refresh: query(
        collection(db, "posts"),
        where("tags", "array-contains", tag),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "posts"),
        where("tags", "array-contains", tag),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}

export function getPostsQueryByUid(uid: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "posts"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT.postsCol3)
      ),
      load: query(
        collection(db, "posts"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refresh: query(
        collection(db, "posts"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "posts"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
export function getPostsQueryByUidAndTag(uid: string, tag: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("tags", "array-contains", tag),
        limit(FETCH_LIMIT.postsCol3)
      ),
      load: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("tags", "array-contains", tag),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refresh: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("tags", "array-contains", tag),
        startAt(pageParams.prevCursor),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("tags", "array-contains", tag),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
