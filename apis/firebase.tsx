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
  Query,
  query,
  QuerySnapshot,
  serverTimestamp,
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

export async function addComment(
  uid: string,
  targetUid: string,
  targetPid: string,
  txt: string
) {
  const newAlarm: IAlarm = {
    uid,
    type: "comment",
    targetUid,
    targetPid,
    createdAt: new Date(),
  };
  const alarmRef = await addDoc(collection(db, "alarms"), newAlarm);

  const tempComment: IComment = {
    uid,
    pid: targetPid,
    aid: alarmRef.id,
    txt,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "comments"), tempComment);
  await updateDoc(ref, {
    id: ref.id,
  });
  await updateDoc(alarmRef, { id: alarmRef.id, targetCid: ref.id });
  return await getDataByRef<IComment>(ref);
}

export async function addLike(
  uid: string,
  targetUid: string,
  targetPid: string
) {
  const newData: IDict<string> = {
    uid,
    pid: targetPid,
  };
  const newAlarm: IAlarm = {
    uid,
    type: "like",
    targetUid,
    targetPid,
    createdAt: new Date(),
  };
  const refAlarm = await addDoc(collection(db, "alarms"), newAlarm);
  await updateDoc(refAlarm, { id: refAlarm.id });
  newData.aid = refAlarm.id;
  const ref = await addDoc(collection(db, "likes"), newData);
  await updateDoc(ref, { id: ref.id });
}

export async function addScrap(uid: string, pid: string) {
  const newData: IDict<string> = {
    uid,
    pid,
    cont: "모든 스크랩",
  };
  const ref = await addDoc(collection(db, "scraps"), newData);
  await updateDoc(ref, { id: ref.id });
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

export async function getPostsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IPost[]]> {
  const snap = await getDocs(q);
  const posts: IPost[] = [];
  for (const doc of snap.docs) {
    const post: IPost = doc.data() as IPost;
    const uid = post.uid;
    const pid = post.id || "";
    const author: IUser = await getData<IUser>("users", uid);
    const likes = await getEach<ILike>("likes", pid);
    const scraps = await getEach<IScrap>("scraps", pid);
    const comments = await getEach<IComment>("comments", pid);
    post.likes = likes ? likes : [];
    post.scraps = scraps ? scraps : [];
    post.comments = comments ? comments : [];
    post.author = author;
    post.createdAt = (post.createdAt as Timestamp).toDate();
    posts.push(post);
  }
  return [snap, posts];
}

export async function getAlarmsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IAlarm[]]> {
  const res: IAlarm[] = await getDatasByQuery(q);
  const snap = await getDocs(q);
  const alarms: IAlarm[] = [];

  for await (const doc of snap.docs) {
    const alarm: IDict<any> = doc.data();
    if (alarm.type === "like") {
      const author = await getData<IUser>("users", alarm.uid);
      const post = await getData<IPost>("posts", alarm.targetPid || "");
      alarm.author = author;
      alarm.post = post;
    } else if (alarm.type === "comment") {
      const author = await getData<IUser>("users", alarm.uid);
      const comment = await getData<IComment>(
        "comments",
        alarm.targetCid || ""
      );
      const post = await getData<IPost>("posts", alarm.targetPid || "");
      alarm.author = author;
      alarm.post = post;
      alarm.comment = comment;
    } else if (alarm.type === "follow") {
      const author = await getData<IUser>("users", alarm.uid);
      alarm.author = author;
    }
    alarm.createdAt = alarm.createdAt.toDate();
    alarms.push(alarm as IAlarm);
  }
  return [snap, alarms];
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
    const alarmRes = await getDatasByQuery(
      query(
        collection(db, "alarms"),
        where("uid", "==", curUser.id),
        where("targetUid", "==", user.id)
      )
    );
    await deleteEach(alarmRes, "alarms");
  } else {
    await updateDoc(curUserRef, {
      followings: arrayUnion(user.id),
    });
    await updateDoc(userRef, {
      followers: arrayUnion(curUser.id),
    });
    const newAlarm: IAlarm = {
      uid: curUser.id,
      type: "follow",
      targetUid: user.id,
      createdAt: new Date(),
    };
    const ref = await addDoc(collection(db, "alarms"), newAlarm);
    await updateDoc(ref, { id: ref.id });
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

export async function deleteLike(id: string, aid: string) {
  await deleteDoc(doc(db, "likes", id));
  await deleteDoc(doc(db, "alarms", aid));
}

export async function deleteScrap(id: string) {
  await deleteDoc(doc(db, "scraps", id));
}
