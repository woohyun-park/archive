// firebase에서 데이터를 읽어오기 위한 api

import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  IAlarm,
  ICollectionType,
  IComment,
  IDict,
  ILike,
  IPost,
  IScrap,
  ITag,
  IUser,
} from "../def";
import { convertCreatedAt, db } from "./fb";

export async function readData<T>(type: ICollectionType, id: string) {
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

export async function readUser(id: string) {
  return await readData<IUser>("users", id);
}

export async function readUsers(docs: QueryDocumentSnapshot<DocumentData>[]) {
  const res: IUser[] = [];
  for await (const doc of docs) {
    const user = await readData<IUser>("users", doc.data().id);
    res.push(user);
  }
  return res;
}

export async function readTagsOfPost(pid: string) {
  return await readDatasByQuery<ITag>(
    query(collection(db, "tags"), where("pid", "==", pid))
  );
}

export async function readLikesOfPost(pid: string) {
  return await readDatasByQuery<ILike>(
    query(collection(db, "likes"), where("pid", "==", pid))
  );
}

export async function readCommentsOfPost(pid: string) {
  return await readDatasByQuery<IComment>(
    query(
      collection(db, "comments"),
      where("pid", "==", pid),
      orderBy("createdAt", "desc")
    )
  );
}

export async function readScrapsOfPost(pid: string) {
  return await readDatasByQuery<IScrap>(
    query(collection(db, "scraps"), where("pid", "==", pid))
  );
}

export async function readAlarmsOfPost(pid: string) {
  return await readDatasByQuery<IAlarm>(
    query(collection(db, "alarms"), where("pid", "==", pid))
  );
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

export async function readPosts(docs: QueryDocumentSnapshot<DocumentData>[]) {
  const res: IPost[] = [];
  for await (const doc of docs) {
    const data = doc.data();
    const id = data.pid ? data.pid : data.id;
    const post = await readPost(id);
    res.push(post);
  }
  return res;
}

// export async function readPostsOfScraps(
//   docs: QueryDocumentSnapshot<DocumentData>[]
// ) {
//   const res: IPost[] = [];
//   for await (const doc of docs) {
//     const post = await readPost(doc.data().pid);
//     res.push(post);
//   }
//   return res;
// }

// export async function readPostsOfTags(
//   docs: QueryDocumentSnapshot<DocumentData>[]
// ) {
//   const res: IPost[] = [];
//   for await (const doc of docs) {
//     const post = await readPost(doc.data().pid);
//     console.log(doc.data());
//     res.push(post);
//   }
//   return res;
// }

export async function readScraps(docs: QueryDocumentSnapshot<DocumentData>[]) {
  const res: IScrap[] = [];
  for await (const doc of docs) {
    res.push(doc.data() as IScrap);
  }
  return res;
}

export async function readTags(docs: QueryDocumentSnapshot<DocumentData>[]) {
  const result: IDict<any> = {};
  for await (const doc of docs) {
    const tag = doc.data();
    const name = tag.name;
    const tid = tag.id;
    if (result[name]) result[name].tags.push(tid);
    else result[name] = { name, tags: [tid] };
  }
  return Object.values(result);
}

export async function readAlarm(aid: string) {
  try {
    const alarm = await readData<IAlarm>("alarms", aid);
    const uid = alarm.uid || "";
    const pid = alarm.pid || "";
    const cid = alarm.cid || "";

    if (alarm.type === "like") {
      const post = await readData<IPost>("posts", pid);
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
  } catch (error) {
    console.log(error);
  }
}

export async function readAlarms(docs: QueryDocumentSnapshot<DocumentData>[]) {
  const postDict: IDict<IPost> = {};
  const commentDict: IDict<IComment> = {};
  const authorDict: IDict<IUser> = {};
  const res: IAlarm[] = [];
  for await (const doc of docs) {
    const alarm = doc.data();
    alarm.createdAt = convertCreatedAt(alarm.createdAt);
    const uid = alarm.uid;
    const pid = alarm.pid || "";
    const cid = alarm.cid || "";

    if (alarm.type === "like") {
      let post;
      if (postDict[pid]) {
        post = postDict[pid];
      } else {
        post = await readData<IPost>("posts", pid || "");
        postDict[pid] = post;
      }
      alarm.post = post;
    } else if (alarm.type === "comment") {
      let post;
      if (postDict[pid]) {
        post = postDict[pid];
      } else {
        post = await readData<IPost>("posts", pid || "");
        postDict[pid] = post;
      }
      let comment;
      if (commentDict[cid]) {
        comment = commentDict[cid];
      } else {
        comment = await readData<IComment>("comments", cid);
        commentDict[cid] = comment;
      }
      alarm.post = post;
      alarm.comment = comment;
    } else if (alarm.type === "follow") {
    }
    let author;
    if (authorDict[uid]) {
      author = authorDict[uid];
    } else {
      author = await readData<IUser>("users", uid);
      authorDict[cid] = author;
    }
    alarm.author = author;
    res.push(alarm as IAlarm);
  }
  return res;
}

export async function readComment(cid: string) {
  return await readData<IComment>("comments", cid);
}
