import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { IComment, IDict, ILike, IPost, IScrap, ITag, IUser } from "../custom";

interface IPathParams {
  params: { [param: string]: string };
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export async function getData<T>(type: string, id: string): Promise<T> {
  const snap = await getDoc(doc(db, type, id));
  const data = snap.data() as IDict<any>;

  if (data.createdAt)
    return { ...(data as T), createdAt: data.createdAt.toDate() };
  return data as T;
}

export async function getDataByQuery<T>(
  type: string,
  p1: string,
  p2: string,
  p3: string
): Promise<T[]> {
  const ref = collection(db, type);
  const snap = await getDocs(query(ref, where(p1, p2 as WhereFilterOp, p3)));
  const datas: T[] = [];

  snap.forEach((doc) => {
    const data = doc.data();
    if (data.createdAt) {
      datas.push({
        ...(data as T),
        createdAt: data.createdAt.toDate(),
      });
    } else {
      datas.push({
        ...(data as T),
      });
    }
  });
  return datas;
}

export async function getPath(type: string, param: string) {
  const snap = await getDocs(collection(db, type));
  const paths: IPathParams[] = [];

  snap.forEach((post) => {
    paths.push({ params: { [param]: post.id } });
  });
  return paths;
}
