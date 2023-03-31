import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { IFetchType } from "../apis/fbDef";
import { IDict } from "../apis/interface";

export async function wrapPromise(
  callback: Function,
  delay: number
): Promise<IDict<any>> {
  let res: IDict<any> = {};
  await Promise.all([
    callback(),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(0);
      }, delay);
    }),
  ]).then((values) => {
    res = values[0];
  });
  return res;
}

export function combineData<T>(prevData: T[], data: T[], type: IFetchType) {
  if (type === "init") return [...data];
  else if (type === "load") return [...prevData, ...data];
  else return [...data];
}

export function setCursor(
  snap: QuerySnapshot<DocumentData>,
  type: IFetchType
): QueryDocumentSnapshot<DocumentData> | null {
  if (snap.docs.length !== 0) {
    if (type === "init") {
      return snap.docs[snap.docs.length - 1];
    } else if (type === "load") {
      return snap.docs[snap.docs.length - 1];
    } else {
      return snap.docs[snap.docs.length - 1];
    }
  }
  return null;
}
