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

export function getTagsQueryByKeyword(keyword: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "tags"),
        orderBy("name"),
        startAt(keyword),
        endAt(keyword + "\uf8ff"),
        limit(FETCH_LIMIT.scraps)
      ),
      load: query(
        collection(db, "tags"),
        orderBy("name"),
        startAfter(pageParams.nextCursor),
        endAt(keyword + "\uf8ff"),
        limit(FETCH_LIMIT.scraps)
      ),
      refresh: query(
        collection(db, "tags"),
        orderBy("name"),
        startAt(keyword),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "tags"),
        orderBy("name"),
        startAt(keyword),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
export function getTagsQueryByUid(uid: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "tags"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        limit(FETCH_LIMIT.scraps)
      ),
      load: query(
        collection(db, "tags"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.scraps)
      ),
      refresh: query(
        collection(db, "tags"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        startAt(pageParams.prevCursor),
        limit(FETCH_LIMIT.scraps)
      ),
      refreshNew: query(
        collection(db, "tags"),
        orderBy("createdAt", "desc"),
        where("uid", "==", uid),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
