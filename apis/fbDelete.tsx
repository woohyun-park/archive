import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IData, ITag } from "../libs/custom";
import {
  readAlarmsOfPost,
  readCommentsOfPost,
  readLikesOfPost,
  readScrapsOfPost,
  readTagsOfPost,
} from "./fbRead";
import { db } from "./firebase";

export async function deleteAll(datas: IData[], type: string) {
  for await (const data of datas) {
    await deleteDoc(doc(db, type, data.id));
  }
}

export async function deleteTag(tag: string, tid: string) {
  const ref = doc(db, "tagConts", tag);
  await deleteDoc(doc(db, "tags", tid));
  await updateDoc(ref, { tags: arrayRemove(tid) });
}

export async function deleteTags(tags: ITag[]) {
  for await (const tag of tags) {
    await deleteTag(tag.name, tag.id);
  }
}

export async function deletePost(pid: string) {
  const ref = doc(db, "posts", pid);
  const likes = await readLikesOfPost(pid);
  const scraps = await readScrapsOfPost(pid);
  const comments = await readCommentsOfPost(pid);
  const tags = await readTagsOfPost(pid);
  const alarms = await readAlarmsOfPost(pid);
  await deleteDoc(doc(db, "posts", pid));
  await deleteAll(likes, "likes");
  await deleteAll(scraps, "scraps");
  await deleteAll(comments, "comments");
  await deleteAll(alarms, "alarms");
  await deleteTags(tags);
  return ref;
}

export async function deleteLike(lid: string, aid: string) {
  await deleteDoc(doc(db, "likes", lid));
  aid && (await deleteDoc(doc(db, "alarms", aid)));
}

export async function deleteComment(cid: string, aid: string) {
  await deleteDoc(doc(db, "comments", cid));
  aid && (await deleteDoc(doc(db, "comments", aid)));
}

export async function deleteScrap(sid: string) {
  await deleteDoc(doc(db, "scraps", sid));
}
