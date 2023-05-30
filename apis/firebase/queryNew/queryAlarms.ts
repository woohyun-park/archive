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

export function getAlarmsQueryByUid(uid: string) {
  return (pageParams: IPageParam) => {
    return {
      init: query(
        collection(db, "alarms"),
        where("targetUid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(FETCH_LIMIT.alarms)
      ),
      load: query(
        collection(db, "alarms"),
        where("targetUid", "==", uid),
        orderBy("createdAt", "desc"),
        startAfter(pageParams.nextCursor),
        limit(FETCH_LIMIT.alarms)
      ),
      refresh: query(
        collection(db, "alarms"),
        where("targetUid", "==", uid),
        orderBy("createdAt", "desc"),
        startAt(pageParams.prevCursor),
        endAt(pageParams.nextCursor)
      ),
      refreshNew: query(
        collection(db, "alarms"),
        where("targetUid", "==", uid),
        orderBy("createdAt", "desc"),
        endAt(pageParams.nextCursor)
      ),
    };
  };
}
