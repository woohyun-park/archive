import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { IPost, IUser } from "../custom";

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
    console.log(snap);
    if (!snap.data()) return null;
    const post: IPost = {
      ...(snap.data() as IPost),
      createdAt: snap.data()?.createdAt.toDate(),
      id: snap.id,
    };
    return post.isDeleted ? null : post;
  }
  if (type === "users") {
    const snap = await getDoc(doc(db, "users", id));
    if (!snap.data()) return null;
    const user: IUser = {
      ...(snap.data() as IUser),
      uid: snap.id,
    };
    return user;
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
