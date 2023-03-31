// cloudinary로 이미지를 손쉽게 업로드하기 위한 api

import axios, { AxiosRequestConfig } from "axios";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { UseFormWatch } from "react-hook-form";
import { createTags } from "../apis/firebase/fbCreate";
import { deleteTags } from "../apis/firebase/fbDelete";
import { readTagsOfPost } from "../apis/firebase/fbRead";
import { db } from "../apis/firebase/fb";
import { IForm } from "../pages/add";
import { IPost, IUser } from "./interface";

type IHandleImage = IHandleColor & {
  watch: UseFormWatch<IForm>;
};

type IHandleColor = {
  prevPost: IPost | undefined;
  data: IForm;
  curUser: IUser;
  tags: string[];
};

export async function handleImage({
  watch,
  prevPost,
  data,
  curUser,
  tags,
}: IHandleImage) {
  // 이미지를 올린 경우
  const post = {
    title: data.title,
    txt: data.txt,
    color: data.color,
    tags,
  };
  let pid = (prevPost && prevPost.id) || "";
  if (watch("file").length !== 0) {
    const res = await uploadImage(data.file);
    if (prevPost) {
      // 이미지를 올렸으며 수정인 경우
      await updateDoc(doc(db, "posts", prevPost.id as string), {
        ...post,
        imgs: [res.data.url],
      });
      deleteAndCreateTags(tags, pid, curUser.id);
    } else {
      // 이미지를 올렸으며 등록인 경우
      const postRef = await addDoc(collection(db, "posts"), {
        ...post,
        uid: curUser.id,
        createdAt: serverTimestamp(),
        imgs: [res.data.url],
      });
      await updateDoc(postRef, { id: postRef.id });
      pid = postRef.id;
    }
    createTags(tags, curUser.id, pid);
  } else {
    if (prevPost) {
      // 이미지를 올리지 않았으며 수정인 경우
      await updateDoc(doc(db, "posts", pid as string), {
        ...post,
        imgs: [...prevPost.imgs],
      });
      deleteAndCreateTags(tags, pid, curUser.id);
    } else {
      // 이미지를 올리지 않았으며 등록인 경우
      // validation에서 필터해줌
    }
  }
  return pid;
}

export async function handleColor({
  prevPost,
  data,
  tags,
  curUser,
}: IHandleColor) {
  const post = {
    title: data.title,
    txt: data.txt,
    color: data.color,
    imgs: [],
    tags,
  };
  const uid = curUser.id;
  let pid;
  if (prevPost) {
    // 수정인 경우
    pid = prevPost?.id;
    if (!pid) return;
    await updateDoc(doc(db, "posts", pid), {
      ...post,
    });
    deleteAndCreateTags(tags, pid, uid);
  } else {
    // 신규인 경우
    const postRef = await addDoc(collection(db, "posts"), {
      ...post,
      uid,
      createdAt: serverTimestamp(),
    });
    pid = postRef.id;
    await updateDoc(postRef, { id: pid });
    createTags(tags, uid, pid);
  }
  return pid;
}

async function deleteAndCreateTags(
  tags: string[],
  pid: string | undefined,
  uid: string | undefined
) {
  if (!pid || !uid) return;
  const tagsToDelete = await readTagsOfPost(pid);
  deleteTags(tagsToDelete);
  createTags(tags, uid, pid);
}

async function uploadImage(file: File[]) {
  const formData = new FormData();
  const config: AxiosRequestConfig<FormData> = {
    headers: { "Content-Type": "multipart/form-data" },
  };
  formData.append("api_key", process.env.NEXT_PUBLIC_CD_API_KEY || "");
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CD_UPLOADE_PRESET || ""
  );
  formData.append(`file`, file[0]);

  return await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
    formData,
    config
  );
}
