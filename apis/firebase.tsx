import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  Query,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { IComment, IDict, ILike, IScrap, ITag, IUser } from "../libs/custom";

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

export async function addTags(
  arr: string[],
  uid: string,
  pid: string | undefined
) {
  for await (const tag of arr) {
    const tempTag: ITag = {
      uid,
      pid,
      name: tag,
    };
    const tagRef = await addDoc(collection(db, "tags"), tempTag);
    await updateDoc(tagRef, { id: tagRef.id });
  }
}

export async function getData<T>(type: string, id: string): Promise<T> {
  const snap = await getDoc(doc(db, type, id));
  const data = snap.data() as IDict<any>;

  if (data.createdAt)
    return { ...(data as T), createdAt: data.createdAt.toDate() };
  return data as T;
}

export async function getDataByRef<T>(ref: DocumentReference) {
  const snap = await getDoc(ref);
  const data = snap.data();
  if (data?.createdAt) {
    return {
      ...(data as T),
      createdAt: data.createdAt.toDate(),
    };
  }
  return data as T;
}

export async function getDatasByQuery<T>(q: Query) {
  const snap = await getDocs(q);
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

export async function getEach<T>(type: string, id: string) {
  return (await getDatasByQuery<T>(
    query(collection(db, type), where("pid", "==", id))
  )) as T[];
}

export async function getPath(type: string, param: string) {
  const snap = await getDocs(collection(db, type));
  const paths: IPathParams[] = [];

  snap.forEach((post) => {
    paths.push({ params: { [param]: post.id } });
  });
  return paths;
}

export async function updateUser(newUser: IDict<any>) {
  await updateDoc(doc(db, "users", newUser.id), {
    ...newUser,
  });
}

export async function updateFollow(
  curUser: IUser,
  user: IUser,
  isFollowing: boolean
) {
  const curUserRef = doc(db, "users", curUser.id);
  const userRef = doc(db, "users", user.id);
  if (isFollowing) {
    await updateDoc(curUserRef, { followings: arrayRemove(user.id) });
    await updateDoc(userRef, {
      followers: arrayRemove(curUser.id),
    });
  } else {
    await updateDoc(curUserRef, {
      followings: arrayUnion(user.id),
    });
    await updateDoc(userRef, {
      followers: arrayUnion(curUser.id),
    });
  }
}

export async function deleteEach(datas: any[], type: string) {
  for await (const data of datas) {
    const id = data.id as string;
    await deleteDoc(doc(db, type, id));
  }
}

export async function deletePost(id: string) {
  const ref = doc(db, "posts", id);
  await deleteDoc(doc(db, "posts", id));
  const likes = await getEach<ILike>("likes", id);
  const scraps = await getEach<IScrap>("scraps", id);
  const tags = await getEach<ITag>("tags", id);
  const comments = await getEach<IComment>("comments", id);
  deleteEach(likes, "likes");
  deleteEach(scraps, "scraps");
  deleteEach(comments, "comments");
  deleteEach(tags, "tags");

  return ref;
}
