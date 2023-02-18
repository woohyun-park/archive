import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { IAlarm, IComment, ILike, ITag } from "../libs/custom";
import { db, getDataByRef } from "./firebase";

// ALERT:한개의 데이터를 추가하는 create 함수들은 ref를 반환하고,
// 여러개의 데이터를 추가하는 create 함수들은 void를 반환한다

async function createDoc(
  type: "tags" | "likes" | "alarms" | "comments",
  data: ITag | ILike | IAlarm | IComment
) {
  const ref = await addDoc(collection(db, type), data);
  await updateDoc(ref, { id: ref.id });
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
  let ref;
  const newComment: IComment = {
    id: "",
    uid,
    pid,
    txt,
    createdAt: serverTimestamp(),
  };
  if (uid === targetUid) {
    ref = await createDoc("comments", newComment);
  } else {
    const newAlarm: IAlarm = {
      id: "",
      uid,
      type: "comment",
      targetUid,
      pid,
      createdAt: serverTimestamp(),
    };
    ref = await createDoc("comments", newComment);
    const alarmRef = await createDoc("alarms", newAlarm);
    await updateDoc(alarmRef, { cid: ref.id });
  }
  return ref;
}

export async function createLike(uid: string, targetUid: string, pid: string) {
  const newAlarm: IAlarm = {
    id: "",
    uid,
    type: "like",
    targetUid,
    pid,
    createdAt: serverTimestamp(),
  };
  const refAlarm = await createDoc("alarms", newAlarm);
  const newLike: ILike = {
    id: "",
    uid,
    pid,
    aid: refAlarm.id,
    createdAt: serverTimestamp(),
  };
  return await createDoc("likes", newLike);
}

export async function createTags(
  tags: string[],
  uid: string,
  pid: string | undefined
) {
  for await (const tag of tags) {
    const newTag: ITag = { id: "", uid, pid, name: tag };
    await createDoc("tags", newTag);
  }
}
