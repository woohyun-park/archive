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
import { watch } from "fs";
import Color from "../components/Color";

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
    setValue,
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
  const [preview, setPreview] = useState<string>("");
  const [isImage, setIsImage] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLOR.red);
  const router = useRouter();
  console.log(watch());

  async function onValid(data: IForm) {
    if (isImage) {
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
      console.log(data.color);
      const ref = await addDoc(collection(db, "posts"), {
        color: data.color,
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
  function handleToggleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsImage(!isImage);
  }
  function handleColorClick(color: string) {
    setValue("color", color);
    setSelectedColor(color);
  }

  return (
    <>
      <div className="back" onClick={() => router.back()}>
        <HiArrowLeft size={SIZE.icon} />
      </div>
      <form onSubmit={handleSubmit((data) => onValid(data))}>
        <div className="btnCont">
          <button
            className={isImage ? "btn-left g-button1" : "btn-left g-button2"}
            onClick={handleToggleClick}
          >
            이미지 업로드
          </button>
          <button
            className={isImage ? "g-button2" : "g-button1"}
            onClick={handleToggleClick}
          >
            배경색 선택
          </button>
        </div>
        {isImage ? (
          preview === "" ? (
            <div className="imgBg" onClick={handleImageClick}>
              <div className="select">+</div>
            </div>
          ) : (
            <div className="imgCont" onClick={handleImageClick}>
              <img className="img" src={preview} />
            </div>
          )
        ) : (
          <div className="colorCont">
            <Color
              color={COLOR.red}
              onClick={() => handleColorClick(COLOR.red)}
              selected={selectedColor === COLOR.red}
            ></Color>
            <Color
              color={COLOR.orange}
              onClick={() => handleColorClick(COLOR.orange)}
              selected={selectedColor === COLOR.orange}
            ></Color>
            <Color
              color={COLOR.yellow}
              onClick={() => handleColorClick(COLOR.yellow)}
              selected={selectedColor === COLOR.yellow}
            ></Color>
            <Color
              color={COLOR.green}
              onClick={() => handleColorClick(COLOR.green)}
              selected={selectedColor === COLOR.green}
            ></Color>
            <Color
              color={COLOR.blue}
              onClick={() => handleColorClick(COLOR.blue)}
              selected={selectedColor === COLOR.blue}
            ></Color>
            <Color
              color={COLOR.navy}
              onClick={() => handleColorClick(COLOR.navy)}
              selected={selectedColor === COLOR.navy}
            ></Color>
            <Color
              color={COLOR.purple}
              onClick={() => handleColorClick(COLOR.purple)}
              selected={selectedColor === COLOR.purple}
            ></Color>
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
          .btnCont {
            display: flex;
            justify-content: space-evenly;
          }
          .btn-left {
            margin-right: 8px;
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
          .colorCont {
            display: flex;
            justify-content: space-between;
            margin: 16px 0;
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
