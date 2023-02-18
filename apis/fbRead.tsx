import {
  collection,
  doc,
  getDoc,
  getDocs,
  Query,
  query,
  where,
} from "firebase/firestore";
import {
  IAlarm,
  IComment,
  ILike,
  IPost,
  IScrap,
  ITag,
  IUser,
} from "../libs/custom";
import { convertCreatedAt, db, IDataType } from "./firebase";

export async function readData<T>(type: IDataType, id: string) {
  const data = (await getDoc(doc(db, type, id))).data();
  return { ...data, createdAt: convertCreatedAt(data?.createdAt) } as T;
}

export async function readDatasByQuery<T>(q: Query) {
  const snap = await getDocs(q);
  const datas: T[] = [];
  snap.forEach((doc) => {
    const data = doc.data();
    datas.push({
      ...data,
      createdAt: convertCreatedAt(data.createdAt),
    } as T);
  });
  return datas;
}

export async function readPost(pid: string) {
  const post = await readData<IPost>("posts", pid);
  const author = await readData<IUser>("users", post.uid);
  const likes = await readLikesOfPost(pid);
  const comments = await readCommentsOfPost(pid);
  const scraps = await readScrapsOfPost(pid);
  post.author = author;
  post.likes = likes;
  post.comments = comments;
  post.scraps = scraps;
  return post;
}

export async function readTagsOfPost(pid: string) {
  return await readDatasByQuery<ITag>(
    query(collection(db, "tags"), where("pid", "==", pid))
  );
}

export async function readAlarm(aid: string) {
  const alarm = await readData<IAlarm>("alarms", aid);
  const uid = alarm.uid;
  const pid = alarm.pid || "";
  const cid = alarm.cid || "";

  if (alarm.type === "like") {
    const post = await readData<IPost>("posts", pid || "");
    alarm.post = post;
  } else if (alarm.type === "comment") {
    const comment = await readData<IComment>("comments", cid);
    const post = await readData<IPost>("posts", pid);
    alarm.post = post;
    alarm.comment = comment;
  } else if (alarm.type === "follow") {
  }
  const author = await readData<IUser>("users", uid);
  alarm.author = author;
  return alarm as IAlarm;
}

export async function readAlarmsOfPost(pid: string) {
  return await readDatasByQuery<IAlarm>(
    query(collection(db, "alarms"), where("pid", "==", pid))
  );
}

export async function readLikesOfPost(pid: string) {
  return await readDatasByQuery<ILike>(
    query(collection(db, "likes"), where("pid", "==", pid))
  );
}

export async function readComment(cid: string) {
  return await readData<IComment>("comments", cid);
}

export async function readCommentsOfPost(pid: string) {
  return await readDatasByQuery<IComment>(
    query(collection(db, "comments"), where("pid", "==", pid))
  );
}

export async function readScrapsOfPost(pid: string) {
  return await readDatasByQuery<IScrap>(
    query(collection(db, "scraps"), where("pid", "==", pid))
  );
}
