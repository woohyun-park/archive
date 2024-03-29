// firebase에 데이터 업데이트를 위한 api

import { IAlarm, IDict, IUser } from "../def";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { IField } from "consts/firebase";
import { createDoc } from "./fbCreate";
import { db } from "./fb";
import { deleteAll } from "./fbDelete";
import { readDatasByQuery } from "./fbRead";

export async function updateUser(field: IDict<any>) {
  return await updateDoc(doc(db, "users", field.id), {
    ...field,
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
      isViewed: false,
    };
    await createDoc("alarms", newAlarm);
  }
}

export function viewAlarm(alarm: IAlarm) {
  !alarm.isViewed &&
    updateDoc(doc(db, "alarms", alarm.id), {
      isViewed: true,
    });
}

export function viewAlarms(alarms: IAlarm[]) {
  for (const alarm of alarms) {
    !alarm.isViewed &&
      updateDoc(doc(db, "alarms", alarm.id), {
        isViewed: true,
      });
  }
}

export async function updateAlarms(fields: IField[]) {
  for (let field of fields) {
    await updateDoc(doc(db, "alarms", field.id), {
      ...field,
    });
  }
}
