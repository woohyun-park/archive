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
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { ILike, IPost, IScrap, ITag, IUser } from "../custom";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app);

export async function getData(
  type: string,
  id: string
): Promise<IPost | IUser | null> {
  if (type === "posts") {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.data()) return null;
    const post: IPost = {
      ...(snap.data() as IPost),
      createdAt: snap.data()?.createdAt.toDate(),
      id: snap.id,
    };
    return post;
  }
  if (type === "users") {
    const snap = await getDoc(doc(db, "users", id));
    if (!snap.data()) return null;
    const user: IUser = {
      ...(snap.data() as IUser),
      id: snap.id,
    };
    return user;
  }
  return null;
}

export async function getDataByQuery(
  type: string,
  p1: string,
  p2: string,
  p3: string
) {
  const ref = collection(db, type);
  const snap = await getDocs(query(ref, where(p1, p2 as WhereFilterOp, p3)));
  if (type === "posts") {
    const posts: IPost[] = [];
    snap.forEach((doc) => {
      posts.push({
        ...(doc.data() as IPost),
        createdAt: doc.data().createdAt.toDate(),
        id: doc.id,
      });
    });
    return posts;
  } else if (type === "tags") {
    const tags: ITag[] = [];
    snap.forEach((doc) => {
      tags.push({
        ...(doc.data() as ITag),
      });
    });
    return tags;
  } else if (type === "likes") {
    const likes: ILike[] = [];
    snap.forEach((doc) => {
      likes.push({
        ...(doc.data() as ILike),
      });
    });
    return likes;
  } else if (type === "scraps") {
    const scraps: IScrap[] = [];
    snap.forEach((doc) => {
      scraps.push({
        ...(doc.data() as IScrap),
      });
    });
    return scraps;
  }
  return null;
}

export async function getPath(type: string, param: string) {
  const snap = await getDocs(collection(db, type));
  const paths: unknown[] = [];
  snap.forEach((post) => {
    paths.push({ params: { [param]: post.id } });
  });
  return paths;
}
