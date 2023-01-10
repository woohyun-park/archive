import axios, { AxiosRequestConfig } from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db } from "../apis/firebase";
import { COLOR, IPost, SIZE } from "../custom";
import { useStore } from "../apis/zustand";
import { useRouter } from "next/router";
import { HiArrowLeft } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { userAgent } from "next/server";

interface IForm {
  file: File[];
  title: string;
  tags: string[];
  txt: string;
  color: string;
}

export default function Add() {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<IForm>({
    defaultValues: {
      file: undefined,
      title: "",
      tags: [],
      txt: "",
      color: "",
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState(curUser.photoURL);
  const router = useRouter();

  async function onValid(data: IForm) {
    // handleSubmit
    if (data.file !== undefined) {
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
      await axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
          formData,
          config
        )
        .then(async (res) => {
          const ref = await addDoc(collection(db, "posts"), {
            color: "",
            comments: [],
            createdAt: serverTimestamp(),
            imgs: [res.data.url],
            tags: data.tags[0].split(" "),
            title: data.title,
            txt: data.txt,
            uid: curUser.uid,
          });
          const tempPosts = curUser.posts;
          tempPosts.push(ref.id);
          setCurUser({ ...curUser, posts: tempPosts });
          updateCurUser({ ...curUser, posts: tempPosts });
        });
    } else {
      const ref = await addDoc(collection(db, "posts"), {
        color: "",
        comments: [],
        createdAt: serverTimestamp(),
        imgs: [],
        tags: data.tags[0].split(" "),
        title: data.title,
        txt: data.txt,
        uid: curUser.uid,
      });
      const tempPosts = curUser.posts;
      tempPosts.push(ref.id);
      setCurUser({ ...curUser, posts: tempPosts });
      updateCurUser({ ...curUser, posts: tempPosts });
    }
    router.push("/");
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    file.onChange(e);
    if (!e.target.files) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };
  }
  function handleImageClick() {
    fileRef.current?.click();
  }

  // const [imageFile, setImageFile] = useState("");
  // const imageInputRef = useRef<HTMLInputElement>(null);

  // function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const { name, value } = e.currentTarget;
  //   if (name === "tags") {
  //     setNewPost({
  //       ...newPost,
  //       [name]: [value],
  //     });
  //   } else {
  //     setNewPost({
  //       ...newPost,
  //       [name]: value,
  //     });
  //   }
  // }
  // function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   const { name, value } = e.currentTarget;
  //   setNewPost({
  //     ...newPost,
  //     [name]: value,
  //   });
  // }
  // function handleImageClick() {
  //   imageInputRef.current?.click();
  // }
  // function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   if (e.target.files === null) {
  //     return;
  //   }
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     if (typeof reader.result === "string") {
  //       setNewPost({ ...newPost, imgs: [reader.result] });
  //       setImageFile(reader.result);
  //     }
  //     e.target.value = "";
  //   };
  // }

  // async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
  //   e.preventDefault();
  //   if (newPost.imgs.length === 1) {
  //     const formData = new FormData();
  //     const config: AxiosRequestConfig<FormData> = {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     };
  //     formData.append("api_key", process.env.NEXT_PUBLIC_CD_API_KEY || "");
  //     formData.append(
  //       "upload_preset",
  //       process.env.NEXT_PUBLIC_CD_UPLOADE_PRESET || ""
  //     );
  //     formData.append(`file`, imageFile);
  //     await axios
  //       .post(
  //         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
  //         formData,
  //         config
  //       )
  //       .then(async (res) => {
  //         const ref = await addDoc(collection(db, "posts"), {
  //           ...newPost,
  //           tags: newPost.tags[0].split(" "),
  //           imgs: [res.data.url],
  //         });
  //         const tempPosts = curUser.posts;
  //         tempPosts.push(ref.id);
  //         setCurUser({ ...curUser, posts: tempPosts });
  //         updateCurUser({ ...curUser, posts: tempPosts });
  //       });
  //   } else {
  //     const ref = await addDoc(collection(db, "posts"), {
  //       ...newPost,
  //       tags: newPost.tags[0].split(" "),
  //       color: "blue",
  //     });
  //     const tempPosts = curUser.posts;
  //     tempPosts.push(ref.id);
  //     setCurUser({ ...curUser, posts: tempPosts });
  //     updateCurUser({ ...curUser, posts: tempPosts });
  //   }
  //   router.push("/");
  // }

  return (
    <>
      <div className="back" onClick={() => router.back()}>
        <HiArrowLeft size={SIZE.icon} />
      </div>
      <form onSubmit={handleSubmit((data) => onValid(data))}>
        {watch("file") === undefined ? (
          <div className="imgBg" onClick={handleImageClick}>
            <div className="select">+</div>
          </div>
        ) : (
          <div className="imgCont" onClick={handleImageClick}>
            <img className="img" src={preview} />
          </div>
        )}
        <input
          {...register("file")}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={(e) => {
            file.ref(e);
            fileRef.current = e;
          }}
          hidden
        />
        <input {...register("title")} placeholder="제목" />
        <input {...register("tags")} placeholder="태그" />
        <textarea {...register("txt")} placeholder="내용" />
        {/* <input
          name="title"
          value={newPost.title}
          onChange={handleChange}
          placeholder="제목"
        />
        <input
          name="tags"
          value={newPost.tags}
          onChange={handleChange}
          placeholder="태그(첫번째 태그가 메인태그, 띄어쓰기로 구분)"
        />
        <textarea
          name="txt"
          value={newPost.txt}
          onChange={handleTextareaChange}
          placeholder="내용"
        /> */}
        <button className="g-button1" type="submit">
          생성
        </button>
      </form>

      <style jsx>
        {`
          button:hover {
            cursor: pointer;
          }
          form {
            display: flex;
            flex-direction: column;
            margin-top: 36px;
          }
          .imgBg {
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            background-color: ${COLOR.bg2};
            border-radius: 8px;
          }
          .imgBg:hover {
            cursor: pointer;
          }
          .select {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 64px;
            transform: translate(-50%, -50%);
            color: ${COLOR.txt2};
            font-weight: 100;
          }
          .imgCont {
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            overflow: hidden;
            border-radius: 16px;
          }
          .img {
            position: absolute;
            top: 0;
            left: 0;
            transform: translate(50, 50);
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          form > input,
          form > textarea {
            margin: 8px 0;
            background-color: ${COLOR.bg2};
            padding: 8px;
            border: none;
            border-radius: 8px;
            font-family: inherit;
          }
          form > textarea {
            height: 128px;
            resize: none;
          }
        `}
      </style>
    </>
  );
}
