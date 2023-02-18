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
import { db, IDataType } from "./firebase";

export async function readData<T>(type: IDataType, id: string) {
  return (await getDoc(doc(db, type, id))).data() as T;
}

export async function readDatasbyQuery<T>(q: Query) {
  const snap = await getDocs(q);
  const datas: T[] = [];
  snap.forEach((doc) => {
    const data = doc.data();
    datas.push(data as T);
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
  return await readDatasbyQuery<ITag>(
    query(collection(db, "tags"), where("pid", "==", pid))
  );
}

export async function readAlarmsOfPost(pid: string) {
  return await readDatasbyQuery<IAlarm>(
    query(collection(db, "alarms"), where("pid", "==", pid))
  );
}

export async function readLikesOfPost(pid: string) {
  return await readDatasbyQuery<ILike>(
    query(collection(db, "likes"), where("pid", "==", pid))
  );
}

export async function readComment(cid: string) {
  return await readData<IComment>("comments", cid);
}

export async function readCommentsOfPost(pid: string) {
  return await readDatasbyQuery<IComment>(
    query(collection(db, "comments"), where("pid", "==", pid))
  );
}

export async function readScrapsOfPost(pid: string) {
  return await readDatasbyQuery<IScrap>(
    query(collection(db, "scraps"), where("pid", "==", pid))
  );
}
