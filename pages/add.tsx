import axios, { AxiosRequestConfig } from "axios";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db, getDataByQuery } from "../apis/firebase";
import { COLOR, IDict, IPost, SIZE, FUNC, ITag, DEFAULT } from "../custom";
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

// interface ITempPost {
//   uid: string;
//   createdAt: FieldValue;
//   title: string;
//   tags: string[];
//   txt: string;
//   imgs: string[];
//   color: string;
//   likes: string[];
//   scraps: string[];
//   comments: string[];
//   isDeleted: boolean;
// }

export default function Add() {
  const { curUser, setCurUser } = useStore();
  const router = useRouter();
  let modifyPost: IPost | null = null;
  if (router.query.post) {
    modifyPost = JSON.parse(router.query.post as string) as IPost;
  }
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<IForm>({
    defaultValues: {
      file: undefined,
      title: modifyPost ? modifyPost.title : "",
      txt: modifyPost ? modifyPost.txt : "",
      color: modifyPost ? modifyPost.color : "",
      tags: modifyPost ? modifyPost.tags : [],
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(
    modifyPost && modifyPost.imgs.length !== 0 ? modifyPost.imgs[0] : ""
  );
  const [isImage, setIsImage] = useState(
    modifyPost ? (modifyPost.imgs.length !== 0 ? true : false) : true
  );
  const [selectedColor, setSelectedColor] = useState(
    modifyPost && modifyPost.imgs.length === 0 ? modifyPost.color : COLOR.red
  );
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(modifyPost ? modifyPost.tags : []);
  const [errors, setErrors] = useState({
    tags: "",
  });

  async function onValid(data: IForm) {
    let resPost = {
      title: data.title,
      txt: data.txt,
      color: "",
      tags,
      imgs: [""],
    };
    if (isImage) {
      if (modifyPost && watch("file").length === 0) {
        resPost.imgs = [...modifyPost.imgs];
      } else {
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
        resPost.imgs = [res.data.url];
      }

      if (modifyPost) {
        const deleteTags = await getDataByQuery<ITag>(
          "tags",
          "pid",
          "==",
          modifyPost.id as string
        );
        for (const tag of deleteTags) {
          await deleteDoc(doc(db, "tags", tag.id as string));
        }
        await updateDoc(doc(db, "posts", modifyPost.id as string), resPost);
        for await (const tag of data.tags) {
          const tempTag: ITag = {
            uid: curUser.id,
            pid: modifyPost.id,
            name: tag,
          };
          const tagRef = await addDoc(collection(db, "tags"), tempTag);
          await updateDoc(tagRef, { id: tagRef.id });
        }
        setCurUser({ id: curUser.id });
      } else {
        const tempPost: IPost = {
          ...resPost,
          uid: curUser.id,
          createdAt: serverTimestamp(),
        };
        const postRef = await addDoc(collection(db, "posts"), tempPost);
        await updateDoc(postRef, { id: postRef.id });
        for await (const tag of data.tags) {
          const tempTag: ITag = {
            uid: curUser.id,
            pid: postRef.id,
            name: tag,
          };
          const tagRef = await addDoc(collection(db, "tags"), tempTag);
          await updateDoc(tagRef, { id: tagRef.id });
        }
        setCurUser({ id: curUser.id });
      }
    } else {
      if (modifyPost) {
        const deleteTags = await getDataByQuery<ITag>(
          "tags",
          "pid",
          "==",
          modifyPost.id as string
        );
        for (const tag of deleteTags) {
          await deleteDoc(doc(db, "tags", tag.id as string));
        }
        await updateDoc(doc(db, "posts", modifyPost.id as string), {
          title: data.title,
          txt: data.txt,
          imgs: [],
          color: data.color,
          tags,
        });
        for await (const tag of data.tags) {
          const tempTag: ITag = {
            uid: curUser.id,
            pid: modifyPost.id,
            name: tag,
          };
          const tagRef = await addDoc(collection(db, "tags"), tempTag);
          await updateDoc(tagRef, { id: tagRef.id });
        }
        setCurUser({ id: curUser.id });
      } else {
        const tempPost: IPost = {
          uid: curUser.id,
          createdAt: serverTimestamp(),
          title: data.title,
          txt: data.txt,
          imgs: [],
          color: data.color,
          tags,
        };
        const postRef = await addDoc(collection(db, "posts"), tempPost);
        await updateDoc(postRef, { id: postRef.id });
        for await (const tag of data.tags) {
          const tempTag: ITag = {
            uid: curUser.id,
            pid: postRef.id,
            name: tag,
          };
          const tagRef = await addDoc(collection(db, "tags"), tempTag);
          await updateDoc(tagRef, { id: tagRef.id });
        }
        setCurUser({ id: curUser.id });
      }
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
    const newTag = e.target.value.split(" ")[0];
    setErrors({
      ...errors,
      tags: "",
    });
    if (newTag.length > 16 && newTag !== " ") {
      return;
    } else if (e.target.value === " ") {
      setTag("");
    } else if (e.target.value.split(" ").length === 2) {
      if (tags.length === 5) {
        setErrors({
          ...errors,
          tags: "태그는 최대 5개까지 추가할 수 있습니다.",
        });
        return;
      }
      if (tags.length === 5) {
        return;
      }
      let tempTags = [...tags];
      const tagIndex = tempTags.findIndex((tempTag) => {
        return tempTag == newTag;
      });
      if (tagIndex === -1) {
        tempTags.push(newTag);
      } else {
        tempTags = [
          ...tempTags.slice(0, tagIndex),
          ...tempTags.slice(tagIndex + 1, tempTags.length),
        ];
        tempTags.unshift(newTag);
      }
      setTags(tempTags);
      setValue("tags", tempTags);
      setTag("");
    } else {
      setErrors({
        ...errors,
        tags: "",
      });
      setTag(newTag);
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
      <div
        className="back"
        onClick={() => {
          if (confirm("아카이브 작성을 취소하시겠습니까?")) router.back();
        }}
      >
        <HiArrowLeft size={SIZE.icon} />
      </div>
      <form
        onSubmit={handleSubmit(
          (data) => onValid(data),
          (e) => {
            console.log(e);
          }
        )}
      >
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
              <img className="img" src={preview} alt={DEFAULT.img.alt} />
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
          {...register("file", {
            required: isImage ? (modifyPost ? false : true) : false,
          })}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={(e) => {
            file.ref(e);
            fileRef.current = e;
          }}
          hidden
        />

        <div className="g_input_labelCont">
          <label className="g_input_label">제목</label>
          <div
            className={
              watch("title").length === 0
                ? "g_input_txtLen g_input_txtLen-invalid "
                : "g_input_txtLen"
            }
          >{`${watch("title").length}/32`}</div>
        </div>
        <input
          {...register("title", { required: true, maxLength: 32 })}
          type="text"
          maxLength={32}
        />

        <div className="g_input_labelCont">
          <label className="g_input_label">태그</label>
          <div
            className={
              tag.length === 0 || errors.tags !== ""
                ? "g_input_txtLen g_input_txtLen-invalid "
                : "g_input_txtLen"
            }
          >
            {errors["tags"] === "" ? `${tag.length}/16` : errors["tags"]}
          </div>
        </div>
        <div className="tagCont">
          {watch("tags")?.map((each) => (
            <span className="tag" key={each}>
              <span className="tagTxt">{each}</span>
              <span id={each} onClick={handleTagRemove}>
                <HiX />
              </span>
            </span>
          ))}
        </div>
        <input
          onChange={handleTagChange}
          value={tag}
          placeholder="태그"
          maxLength={17}
        />

        <div className="g_input_labelCont">
          <label className="g_input_label">내용</label>
          <div
            className={
              watch("txt").length === 0
                ? "g_input_txtLen g_input_txtLen-invalid "
                : "g_input_txtLen"
            }
          >{`${watch("txt").length}/1000`}</div>
        </div>
        <textarea
          {...register("txt", { required: true, maxLength: 1000 })}
          maxLength={1000}
          placeholder="내용"
        />
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
