import axios, { AxiosRequestConfig } from "axios";
import { addDoc, collection } from "firebase/firestore";
import React, { MutableRefObject, useRef, useState } from "react";
import { db } from "../apis/firebase";
import Header from "../components/Header";
import { COLOR, IPost } from "../custom";

export default function Add() {
  //   (async () => {
  //   await addDoc(collection(db, "posts"), {
  //     id: 1,
  //     user: {
  //       name: "blugalore",
  //       img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
  //     },
  //     title: "오래 속삭여도 좋을 이야기",
  //     tags: ["시집", "문학동네", "이은규"],
  //     imgs: [],
  //     color: "#EC6B71",
  //     createdAt: "1일 전",
  //     numLikes: 0,
  //     arrLikes: [],
  //     numComments: 0,
  //     arrComments: [],
  //   });
  // })();
  const [newPost, setNewPost] = useState<IPost>({
    user: {
      name: "iamdooddi",
      img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
    },
    title: "",
    tags: [],
    text: "",
    imgs: [],
    color: "",
    createdAt: "",
    numLikes: 0,
    arrLikes: [],
    numComments: 0,
    arrComments: [],
  });
  const imageInputRef = useRef<HTMLInputElement>();
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
    console.log(newPost);
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
      console.log("handleImageChange", reader.result);
      if (typeof reader.result === "string") {
        setNewPost({ ...newPost, imgs: [reader.result] });
        setImageFile(reader.result);
      }
      e.target.value = "";
    };
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    if (newPost.imgs.length === 1) {
      let formData = new FormData();
      formData.append("api_key", "426129994386455");
      formData.append("upload_preset", "archive");
      formData.append(`file`, imageFile);

      const config: AxiosRequestConfig<FormData> = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      await axios
        .post(
          "https://api.cloudinary.com/v1_1/dl5qaj6le/image/upload",
          formData,
          config
        )
        .then(async (res) => {
          await addDoc(collection(db, "posts"), {
            ...newPost,
            tags: newPost.tags[0].split(" "),
            imgs: [res.data.url],
          });
        });
    } else {
      await addDoc(collection(db, "posts"), {
        ...newPost,
        tags: newPost.tags[0].split(" "),
        color: "blue",
      });
    }

    // (async () => {
    //   await addDoc(collection(db, "posts"), {
    //     user: {
    //       name: "blugalore",
    //       img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
    //     },
    //     title: "오래 속삭여도 좋을 이야기",
    //     tags: ["시집", "문학동네", "이은규"],
    //     imgs: [],
    //     color: "#EC6B71",
    //     createdAt: "1일 전",
    //     numLikes: 0,
    //     arrLikes: [],
    //     numComments: 0,
    //     arrComments: [],
    //   });
    // })();
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
          name="text"
          value={newPost.text}
          // ???
          onChange={handleChange}
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
            background-color: ${COLOR.btn};
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
