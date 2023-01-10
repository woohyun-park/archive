import axios, { AxiosRequestConfig } from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db } from "../apis/firebase";
import { COLOR, IDict, IPost, SIZE, FUNC } from "../custom";
import { useStore } from "../apis/zustand";
import { useRouter } from "next/router";
import { HiArrowLeft, HiX } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { userAgent } from "next/server";
import { watch } from "fs";
import Color from "../components/Color";

interface IForm {
  file: File[];
  title: string;
  tags: IDict<boolean>;
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
      tags: {},
      txt: "",
      color: "",
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isImage, setIsImage] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLOR.red);
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState({});
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
            uid: curUser.uid,
            createdAt: serverTimestamp(),
            title: data.title,
            tags: FUNC.filterFalse(data.tags),
            txt: data.txt,
            imgs: [res.data.url],
            color: "",
            likes: {},
            comments: {},
          });
          const tempPosts = { ...curUser.posts };
          tempPosts[ref.id] = true;
          setCurUser({ ...curUser, posts: tempPosts });
          updateCurUser({ ...curUser, posts: tempPosts });
        });
    } else {
      const ref = await addDoc(collection(db, "posts"), {
        uid: curUser.uid,
        createdAt: serverTimestamp(),
        title: data.title,
        tags: FUNC.filterFalse(data.tags),
        txt: data.txt,
        imgs: [],
        color: data.color,
        likes: {},
        comments: {},
      });
      const tempPosts = { ...curUser.posts };
      tempPosts[ref.id] = true;
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
  function handleToggleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsImage(!isImage);
  }
  function handleColorClick(color: string) {
    setValue("color", color);
    setSelectedColor(color);
  }
  function handleTagChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.value === " ") {
      setTag("");
    } else if (
      e.target.value.length !== 1 &&
      e.target.value.split(" ").length === 2
    ) {
      setTags({ ...tags, [tag]: true });
      setValue("tags", { ...tags, [tag]: true });
      setTag("");
    } else {
      setTag(e.target.value);
    }
  }
  function handleTagRemove(e: React.MouseEvent<HTMLSpanElement>) {
    const tag = e.currentTarget.id;
    setTags({ ...tags, [tag]: false });
    setValue("tags", { ...tags, [tag]: false });
  }

  return (
    <>
      <div className="back" onClick={() => router.back()}>
        <HiArrowLeft size={SIZE.icon} />
      </div>
      <form onSubmit={handleSubmit((data) => onValid(data))}>
        <div className="btnCont">
          <div
            className={isImage ? "btn-left g-button1" : "btn-left g-button2"}
            onClick={handleToggleClick}
          >
            이미지 업로드
          </div>
          <div
            className={isImage ? "btn-right g-button2" : "btn-right g-button1"}
            onClick={handleToggleClick}
          >
            배경색 선택
          </div>
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
        <div className="tagCont">
          {(() => {
            const result = [];
            let i = 0;
            for (const each in watch("tags")) {
              if (!watch("tags")[each]) {
                continue;
              } else if (i++ === 0) {
                result.push(
                  <span className="tag tag-main">
                    <span className="tagTxt">{each}</span>
                    <span id={each} onClick={handleTagRemove}>
                      <HiX />
                    </span>
                  </span>
                );
              } else {
                result.push(
                  <span className="tag">
                    <span className="tagTxt">{each}</span>
                    <span id={each} onClick={handleTagRemove}>
                      <HiX />
                    </span>
                  </span>
                );
              }
            }
            return result;
          })()}
        </div>
        <input
          onChange={handleTagChange}
          // onKeyDown={handleEnterTag}
          value={tag}
          placeholder="태그"
        />
        {/* <input {...register("tags")} placeholder="태그" /> */}
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
          .btn-left,
          .btn-right {
            font-size: 16px;
            text-align: center;
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
          .tag {
            display: inline-block;
            background-color: ${COLOR.txtDark2};
            padding: 4px 8px;
            border-radius: 8px;
            width: fit-content;
            margin: 4px 0;
            margin-right: 4px;
            color: ${COLOR.txtDark1};
          }
          .tag-main {
            background-color: ${COLOR.btn1};
            color: ${COLOR.txtDark1};
          }
          .tagTxt {
            margin-right: 4px;
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
