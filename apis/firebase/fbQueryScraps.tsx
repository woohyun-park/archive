import {
  collection,
  DocumentData,
  endAt,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { db } from "./fb";
import { IFetchQueryScraps, IFetchType } from "./fbDef";

export function getScrapsQuery(
  fetchType: IFetchType,
  fetchQuery: IFetchQueryScraps,
  fetchLimit: number,
  lastVisible: QueryDocumentSnapshot<DocumentData> | undefined
) {
  console.log("getScrapsQuery", fetchType, fetchQuery, fetchLimit, lastVisible);
  const uid = fetchQuery.value.uid;
  if (fetchType === "init")
    return query(
      collection(db, "scraps"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  if (fetchType === "load")
    return query(
      collection(db, "scraps"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(fetchLimit)
    );
  return query(
    collection(db, "scraps"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    endAt(lastVisible)
  );
}
