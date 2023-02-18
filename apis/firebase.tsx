import { initializeApp } from "firebase/app";
import { FieldValue, getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  IAlarm,
  IComment,
  ILike,
  IPost,
  IScrap,
  ITag,
  IUser,
} from "../libs/custom";

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

export function convertCreatedAt(createdAt: Date | FieldValue) {
  return (createdAt as Timestamp).toDate();
}
