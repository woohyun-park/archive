import { FETCH_LIMIT, IPageParam } from "consts/firebase";
import {
  collection,
  endAt,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";

import { db } from "../fb";

export function getUsersQueryByKeyword(keyword: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "users"),
        orderBy("displayName"),
        startAt(keyword),
        endAt(keyword + "\uf8ff"),
        limit(FETCH_LIMIT.users)
      ),
      load: query(
        collection(db, "users"),
        orderBy("displayName"),
        startAfter(pageParams.nextCursor),
        endAt(keyword + "\uf8ff"),
        limit(FETCH_LIMIT.users)
      ),
      refresh: query(
        collection(db, "users"),
        orderBy("displayName"),
        startAt(keyword),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "users"),
        orderBy("displayName"),
        startAt(keyword),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
