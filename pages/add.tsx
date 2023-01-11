import axios, { AxiosRequestConfig } from "axios";
import {
  addDoc,
  collection,
  FieldValue,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db } from "../apis/firebase";
import { COLOR, IDict, IPost, SIZE, FUNC } from "../custom";
import { useStore } from "../apis/zustand";
import { useRouter } from "next/router";
import { HiArrowLeft, HiX } from "react-icons/hi";
import { useForm } from "react-hook-form";
import Color from "../components/Color";

interface IForm {
  file: File[];
  title: string;
  tags: string[];
  txt: string;
  color: string;
}

interface ITempPost {
  uid: string;
  createdAt: FieldValue;
  title: string;
  tags: string[];
  txt: string;
  imgs: string[];
  color: string;
  likes: string[];
  scraps: string[];
  comments: string[];
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
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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
          const tempPost: ITempPost = {
            uid: curUser.uid,
            createdAt: serverTimestamp(),
            title: data.title,
            tags: data.tags,
            txt: data.txt,
            imgs: [res.data.url],
            color: "",
            likes: [],
            scraps: [],
            comments: [],
          };
          const ref = await addDoc(collection(db, "posts"), tempPost);
          await updateDoc(ref, { id: ref.id });

          const tags = { ...curUser.tags };
          data.tags.forEach((tag) => {
            if (tags[tag]) {
              tags[tag].push(ref.id);
            } else {
              tags[tag] = [ref.id];
            }
          });
          const posts = [...curUser.posts];
          posts.push(ref.id);
          setCurUser({ ...curUser, posts, tags });
          updateCurUser({ ...curUser, posts, tags });
        });
    } else {
      const tempPost: ITempPost = {
        uid: curUser.uid,
        createdAt: serverTimestamp(),
        title: data.title,
        tags: data.tags,
        txt: data.txt,
        imgs: [],
        color: data.color,
        likes: [],
        scraps: [],
        comments: [],
      };

      const ref = await addDoc(collection(db, "posts"), tempPost);
      await updateDoc(ref, { id: ref.id });

      const tags = { ...curUser.tags };
      data.tags.forEach((tag) => {
        if (tags[tag]) {
          tags[tag].push(ref.id);
        } else {
          tags[tag] = [ref.id];
        }
      });
      const posts = [...curUser.posts];
      posts.push(ref.id);
      setCurUser({ ...curUser, posts, tags });
      updateCurUser({ ...curUser, posts, tags });
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
    const tempTag = e.target.value.split(" ")[0];
    if (e.target.value === " ") {
      setTag("");
    } else if (e.target.value.split(" ").length === 2) {
      let tempTags = [...tags];
      const tagIndex = tempTags.findIndex((elem) => {
        return elem == tempTag;
      });
      if (tagIndex === -1) {
        tempTags.push(tempTag);
      } else {
        tempTags = [
          ...tempTags.slice(0, tagIndex),
          ...tempTags.slice(tagIndex + 1, tempTags.length),
        ];
        tempTags.unshift(tempTag);
      }
      setTags(tempTags);
      setValue("tags", tempTags);
      setTag("");
    } else {
      setTag(tempTag);
    }
  }
  function handleTagRemove(e: React.MouseEvent<HTMLSpanElement>) {
    const tag = e.currentTarget.id;
    const tagIndex = tags.findIndex((elem) => elem === tag);
    const tempTags = [
      ...[...tags].slice(0, tagIndex),
      ...[...tags].slice(tagIndex + 1, [...tags].length),
    ];
    setTags(tempTags);
    setValue("tags", tempTags);
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
          {watch("tags").map((each) => (
            <span className="tag">
              <span className="tagTxt">{each}</span>
              <span id={each} onClick={handleTagRemove}>
                <HiX />
              </span>
            </span>
          ))}
        </div>
        <input onChange={handleTagChange} value={tag} placeholder="태그" />
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
            padding: 4px 8px;
            border-radius: 8px;
            width: fit-content;
            margin: 4px 0;
            margin-right: 4px;
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
