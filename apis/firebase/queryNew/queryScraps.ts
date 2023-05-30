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

export function getScrapsQueryByUid(uid: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "scraps"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT.scraps)
      ),
      load: query(
        collection(db, "scraps"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.scraps)
      ),
      refresh: query(
        collection(db, "scraps"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        limit(FETCH_LIMIT.scraps)
      ),
      refreshNew: query(
        collection(db, "scraps"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}

export function getScrapsQueryByUidAndCont(uid: string, cont: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "scraps"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("cont", "==", cont),
        limit(FETCH_LIMIT.postsCol3)
      ),
      load: query(
        collection(db, "scraps"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("cont", "==", cont),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refresh: query(
        collection(db, "scraps"),
        where("uid", "==", uid),
        where("cont", "==", cont),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        limit(FETCH_LIMIT.postsCol3)
      ),
      refreshNew: query(
        collection(db, "scraps"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        where("cont", "==", cont),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
