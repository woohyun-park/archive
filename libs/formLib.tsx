import axios, { AxiosRequestConfig } from "axios";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { UseFormWatch } from "react-hook-form";
import { addTags, db, getEach, removeTags } from "../apis/firebase";
import { IForm } from "../pages/add";
import { IPost, ITag, IUser } from "./custom";

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
  if (watch("file").length !== 0) {
    const formData = new FormData();
    const config: AxiosRequestConfig<FormData> = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    formData.append("api_key", process.env.NEXT_PUBLIC_CD_API_KEY || "");
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CD_UPLOADE_PRESET || ""
    );
    formData.append(`file`, data.file[0]);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
      formData,
      config
    );
    let pid;
    // 이미지를 올렸으며 수정인 경우
    if (prevPost) {
      removeTags(prevPost.id);
      await updateDoc(doc(db, "posts", prevPost.id as string), {
        ...post,
        imgs: [res.data.url],
      });
      pid = prevPost.id;
    }
    // 이미지를 올렸으며 등록인 경우
    else {
      const postRef = await addDoc(collection(db, "posts"), {
        ...post,
        uid: curUser.id,
        createdAt: serverTimestamp(),
        imgs: [res.data.url],
      });
      await updateDoc(postRef, { id: postRef.id });
      pid = postRef.id;
    }
    addTags(data.tags, curUser.id, pid);
  } else {
    // 이미지를 올리지 않았으며 수정인 경우
    if (prevPost) {
      const deleteTags = await getEach<ITag>("tags", prevPost.id as string);
      for (const tag of deleteTags) {
        await deleteDoc(doc(db, "tags", tag.id as string));
      }
      await updateDoc(doc(db, "posts", prevPost.id as string), {
        ...post,
        imgs: [...prevPost.imgs],
      });
      for await (const tag of data.tags) {
        const tempTag: ITag = {
          uid: curUser.id,
          pid: prevPost.id,
          name: tag,
        };
        const tagRef = await addDoc(collection(db, "tags"), tempTag);
        await updateDoc(tagRef, { id: tagRef.id });
      }
    }
    // 이미지를 올리지 않았으며 등록인 경우
    else {
      // validation에서 필터해줌
    }
  }
}

export async function handleColor({
  prevPost,
  data,
  tags,
  curUser,
}: IHandleColor) {
  let pid;
  // 색깔이며 수정인 경우
  if (prevPost) {
    const deleteTags = await getEach<ITag>("tags", prevPost.id as string);
    for (const tag of deleteTags) {
      await deleteDoc(doc(db, "tags", tag.id as string));
    }
    await updateDoc(doc(db, "posts", prevPost.id as string), {
      title: data.title,
      txt: data.txt,
      imgs: [],
      color: data.color,
      tags,
    });
    pid = prevPost.id;
  }
  // 색깔이며 수정이 아닌 경우
  else {
    const postRef = await addDoc(collection(db, "posts"), {
      uid: curUser.id,
      createdAt: serverTimestamp(),
      title: data.title,
      txt: data.txt,
      imgs: [],
      color: data.color,
      tags,
    });
    await updateDoc(postRef, { id: postRef.id });
    pid = postRef.id;
  }
  for await (const tag of data.tags) {
    const tempTag: ITag = {
      uid: curUser.id,
      pid: pid,
      name: tag,
    };
    const tagRef = await addDoc(collection(db, "tags"), tempTag);
    await updateDoc(tagRef, { id: tagRef.id });
  }
}
