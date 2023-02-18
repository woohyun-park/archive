import { collection, query, where } from "firebase/firestore";
import { IComment, ILike } from "../libs/custom";
import { db, getData, getDatasByQuery } from "./firebase";

export async function readComment(cid: string) {
  return await getData<IComment>("comments", cid);
}

export async function readLikes(pid: string) {
  return await getDatasByQuery<ILike>(
    query(collection(db, "likes"), where("pid", "==", pid))
  );
}
