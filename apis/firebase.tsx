import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  IAlarm,
  IComment,
  IDict,
  ILike,
  IPost,
  IScrap,
  ITag,
  IUser,
} from "../libs/custom";
import { deleteAll } from "./fbDelete";
import {
  readData,
  readDatasbyQuery,
  readLikesOfPost,
  readPost,
} from "./fbRead";

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

export type IData = IUser | IPost | ITag | IAlarm | ILike | IComment | IScrap;
export type IDataType =
  | "users"
  | "posts"
  | "tags"
  | "alarms"
  | "likes"
  | "comments"
  | "scraps";

// export async function getData<T>(type: string, id: string): Promise<T | null> {
//   const snap = await getDoc(doc(db, type, id));
//   const data = snap.data() as IDict<any>;
//   if (data === undefined) return null;
//   if (data.createdAt)
//     return { ...(data as T), createdAt: data.createdAt.toDate() };
//   return data as T;
// }

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

export async function getPostsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IPost[]]> {
  const snap = await getDocs(q);
  const posts: IPost[] = [];
  for (const doc of snap.docs) {
    const post = await readPost(doc.data().id);
    if (!post) continue;
    posts.push(post);
  }
  return [snap, posts];
}

export async function getAlarm(id: string, ref?: IDict<any>) {
  const alarm: IDict<any> | null = ref
    ? ref
    : await readData<IAlarm>("alarms", id);
  if (!alarm) return null;
  if (alarm.type === "like") {
    const author = await readData<IUser>("users", alarm.uid);
    const post = await readData<IPost>("posts", alarm.pid || "");
    alarm.author = author;
    alarm.post = post;
  } else if (alarm.type === "comment") {
    const author = await readData<IUser>("users", alarm.uid);
    const comment = await readData<IComment>("comments", alarm.cid || "");
    const post = await readData<IPost>("posts", alarm.pid || "");
    alarm.author = author;
    alarm.post = post;
    alarm.comment = comment;
  } else if (alarm.type === "follow") {
    const author = await readData<IUser>("users", alarm.uid);
    alarm.author = author;
  }
  alarm.createdAt = (alarm.createdAt as Timestamp).toDate();
  return alarm as IAlarm;
}

export async function getAlarmsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IAlarm[]]> {
  const res: IAlarm[] = await readDatasbyQuery(q);
  const snap = await getDocs(q);
  const alarms: IAlarm[] = [];

  for await (const doc of snap.docs) {
    const alarm = await getAlarm(doc.data().id, doc.data());
    if (!alarm) continue;
    alarms.push(alarm);
  }
  return [snap, alarms];
}

export async function getEach<T>(type: string, id: string) {
  console.log(
    type,
    type === "alarms" ? "targetUid" : type === "comments" ? "pid" : "uid"
  );
  return (await readDatasbyQuery<T>(
    query(
      collection(db, type),
      where(
        type === "alarms" ? "targetUid" : type === "comments" ? "pid" : "uid",
        "==",
        id
      ),
      orderBy("createdAt", "desc")
    )
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
    const alarmRes = await readDatasbyQuery<IAlarm>(
      query(
        collection(db, "alarms"),
        where("uid", "==", curUser.id),
        where("targetUid", "==", user.id)
      )
    );
    await deleteAll(alarmRes, "alarms");
  } else {
    await updateDoc(curUserRef, {
      followings: arrayUnion(user.id),
    });
    await updateDoc(userRef, {
      followers: arrayUnion(curUser.id),
    });
    const newAlarm: IAlarm = {
      id: "",
      uid: curUser.id,
      type: "follow",
      targetUid: user.id,
      createdAt: new Date(),
    };
    const ref = await addDoc(collection(db, "alarms"), newAlarm);
    await updateDoc(ref, { id: ref.id });
  }
}
