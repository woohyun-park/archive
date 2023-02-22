import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { IAlarm, IDict, IUser } from "../libs/custom";
import { createDoc } from "./fbCreate";
import { deleteAll } from "./fbDelete";
import { readDatasByQuery } from "./fbRead";
import { db } from "./firebase";

export async function updateUser(field: IDict<any>) {
  const filteredField = Object.fromEntries(
    Object.entries(field).filter(([key, value]) => value)
  );
  await updateDoc(doc(db, "users", field.id), {
    ...filteredField,
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
    await updateDoc(userRef, { followers: arrayRemove(curUser.id) });
    const deleteAlarms = await readDatasByQuery<IAlarm>(
      query(
        collection(db, "alarms"),
        where("uid", "==", curUser.id),
        where("targetUid", "==", user.id)
      )
    );
    await deleteAll(deleteAlarms, "alarms");
  } else {
    await updateDoc(curUserRef, { followings: arrayUnion(user.id) });
    await updateDoc(userRef, { followers: arrayUnion(curUser.id) });
    const newAlarm: IAlarm = {
      id: "",
      uid: curUser.id,
      type: "follow",
      targetUid: user.id,
      createdAt: new Date(),
    };
    await createDoc("alarms", newAlarm);
  }
}