import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { UseFormWatch } from "react-hook-form";
import { uploadImage } from "../apis/fileApi";
import { addTags, db, deleteEach, getEach } from "../apis/firebase";
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
  let pid = (prevPost && prevPost.id) || "";
  if (watch("file").length !== 0) {
    const res = await uploadImage(data.file);
    if (prevPost) {
      // 이미지를 올렸으며 수정인 경우
      await updateDoc(doc(db, "posts", prevPost.id as string), {
        ...post,
        imgs: [res.data.url],
      });
      deleteAndAddTags(tags, pid, curUser.id);
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
    addTags(tags, curUser.id, pid);
  } else {
    if (prevPost) {
      // 이미지를 올리지 않았으며 수정인 경우
      await updateDoc(doc(db, "posts", pid as string), {
        ...post,
        imgs: [...prevPost.imgs],
      });
      deleteAndAddTags(tags, pid, curUser.id);
    } else {
      // 이미지를 올리지 않았으며 등록인 경우
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
  const post = {
    title: data.title,
    txt: data.txt,
    color: data.color,
    imgs: [],
    tags,
  };
  if (prevPost) {
    // 수정인 경우
    if (!prevPost.id) return;
    await updateDoc(doc(db, "posts", prevPost.id), {
      ...post,
    });
    deleteAndAddTags(tags, prevPost.id, curUser.id);
  } else {
    // 신규인 경우
    const postRef = await addDoc(collection(db, "posts"), {
      ...post,
      uid: curUser.id,
      createdAt: serverTimestamp(),
    });
    const pid = postRef.id;
    await updateDoc(postRef, { id: pid });
    addTags(tags, curUser.id, pid);
  }
}

async function deleteAndAddTags(
  tags: string[],
  pid: string | undefined,
  uid: string | undefined
) {
  if (!pid || !uid) return;
  const tagsToDelete = await getEach<ITag>("tags", pid);
  deleteEach(tagsToDelete, "tags");
  addTags(tags, uid, pid);
}
