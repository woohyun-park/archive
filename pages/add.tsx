import axios, { AxiosRequestConfig } from "axios";
import { addDoc, collection } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db } from "../apis/firebase";
import { COLOR, IPost } from "../custom";
import { useStore } from "../apis/zustand";

export default function Add() {
  const { user, setUser } = useStore();
  const [newPost, setNewPost] = useState<IPost>({
    uid: user.uid,
    title: "",
    tags: [],
    txt: "",
    imgs: [],
    color: "",
    createdAt: "",
    likes: [],
    comments: [],
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    if (name === "tags") {
      setNewPost({
        ...newPost,
        [name]: [value],
      });
    } else {
      setNewPost({
        ...newPost,
        [name]: value,
      });
    }
  }
  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.currentTarget;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  }
  function handleImageClick() {
    imageInputRef.current?.click();
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setNewPost({ ...newPost, imgs: [reader.result] });
        setImageFile(reader.result);
      }
      e.target.value = "";
    };
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (newPost.imgs.length === 1) {
      const formData = new FormData();
      const config: AxiosRequestConfig<FormData> = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      formData.append("api_key", process.env.NEXT_PUBLIC_CD_API_KEY || "");
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CD_UPLOADE_PRESET || ""
      );
      formData.append(`file`, imageFile);
      await axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
          formData,
          config
        )
        .then(async (res) => {
          const ref = await addDoc(collection(db, "posts"), {
            ...newPost,
            tags: newPost.tags[0].split(" "),
            imgs: [res.data.url],
          });
          const tempPosts = user.posts;
          tempPosts.push(ref.id);
          setUser({ ...user, posts: tempPosts });
        });
    } else {
      const ref = await addDoc(collection(db, "posts"), {
        ...newPost,
        tags: newPost.tags[0].split(" "),
        color: "blue",
      });
      const tempPosts = user.posts;
      tempPosts.push(ref.id);
      setUser({ ...user, posts: tempPosts });
    }
  }
  return (
    <>
      <h1>create</h1>
      <div className="form">
        {newPost.imgs.length === 0 ? (
          <div className="imgBg" onClick={handleImageClick}>
            <div className="select">+</div>
          </div>
        ) : (
          <div className="imgCont" onClick={handleImageClick}>
            <img className="img" src={newPost.imgs[0]} />
          </div>
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
        <input
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
        />
        <button className="createBtn" onClick={handleSubmit}>
          생성
        </button>
      </div>
      <style jsx>
        {`
          button:hover {
            cursor: pointer;
          }
          .form {
            display: flex;
            flex-direction: column;
          }
          .imgBg {
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            background-color: ${COLOR.bg2};
            border-radius: 8px;
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
          .form > input,
          .form > textarea {
            margin: 8px 0;
            background-color: ${COLOR.bg2};
            padding: 8px;
            border: none;
            border-radius: 8px;
            font-family: inherit;
          }
          .form > textarea {
            height: 240px;
            resize: none;
          }
          .form > button {
            margin: 8px 0;
            background-color: ${COLOR.btn1};
            border: none;
            border-radius: 8px;
            padding: 8px;
            color: ${COLOR.txtDark1};
          }
        `}
      </style>
    </>
  );
}
