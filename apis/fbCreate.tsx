import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { IAlarm, IComment, ILike, IScrap, ITag } from "../libs/custom";
import { db } from "./firebase";

// 한개의 데이터를 추가하는 create 함수들은 ref를 반환하고,
// 여러개의 데이터를 추가하는 create 함수들은 void를 반환한다

export async function createDoc(
  type: "tags" | "likes" | "alarms" | "comments" | "scraps",
  data: ITag | ILike | IAlarm | IComment | IScrap
) {
  const ref = await addDoc(collection(db, type), data);
  await updateDoc(ref, { id: ref.id });
  return ref;
}

export async function createTag(tag: string, uid: string, pid: string) {
  const newTag: ITag = {
    id: "",
    uid,
    pid,
    name: tag,
    createdAt: serverTimestamp(),
  };
  const tagRef = await createDoc("tags", newTag);
  const tagContRef = doc(db, "tagConts", tag);
  const tagContDoc = await getDoc(tagContRef);
  if (tagContDoc.exists())
    await updateDoc(tagContRef, { tags: arrayUnion(tagRef.id) });
  else await setDoc(doc(db, "tagConts", tag), { name: tag, tags: [tagRef.id] });
  return tagRef;
}

export async function createTags(tags: string[], uid: string, pid: string) {
  for await (const tag of tags) {
    createTag(tag, uid, pid);
  }
}

// uid와 targetUid가 같을때는 like만 생성
// uid와 targetUid가 다를때는 like와 alarm을 모두 생성
export async function createLike(uid: string, targetUid: string, pid: string) {
  const newLike: ILike = {
    id: "",
    uid,
    pid,
    createdAt: serverTimestamp(),
  };
  const ref = await createDoc("likes", newLike);
  if (uid === targetUid) return ref;
  const newAlarm: IAlarm = {
    id: "",
    uid,
    type: "like",
    targetUid,
    pid,
    createdAt: serverTimestamp(),
    isViewed: false,
  };
  const alarmRef = await createDoc("alarms", newAlarm);
  await updateDoc(ref, { aid: alarmRef.id });
  await updateDoc(alarmRef, { lid: ref.id });
  return ref;
}

// uid와 targetUid가 같을때는 comment만 생성
// uid와 targetUid가 다를때는 comment와 alarm을 모두 생성
export async function createComment(
  uid: string,
  targetUid: string,
  pid: string,
  txt: string
) {
  const newComment: IComment = {
    id: "",
    uid,
    pid,
    txt,
    createdAt: serverTimestamp(),
  };
  const ref = await createDoc("comments", newComment);
  if (uid === targetUid) return ref;
  const newAlarm: IAlarm = {
    id: "",
    uid,
    type: "comment",
    targetUid,
    pid,
    createdAt: serverTimestamp(),
    isViewed: false,
  };
  const alarmRef = await createDoc("alarms", newAlarm);
  await updateDoc(ref, { aid: alarmRef.id });
  await updateDoc(alarmRef, { cid: ref.id });
  return ref;
}

export async function createScrap(uid: string, pid: string) {
  const newScrap: IScrap = {
    id: "",
    uid,
    pid,
    cont: "모든 스크랩",
    createdAt: serverTimestamp(),
  };
  return await createDoc("scraps", newScrap);
}
