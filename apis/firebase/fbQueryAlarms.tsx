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
import { db } from "./fb";
import { IFetchQueryAlarms, IFetchType } from "./fbDef";

export function getAlarmsQuery(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryAlarms,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
): Query<DocumentData> {
  const uid = fetchQuery.value.uid;
  if (fetchType === "init")
    return query(
      collection(db, "alarms"),
      where("targetUid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "alarms"),
      where("targetUid", "==", uid),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(fetchLimit)
    );
  return query(
    collection(db, "alarms"),
    where("targetUid", "==", uid),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}
