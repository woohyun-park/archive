import axios, { AxiosRequestConfig } from "axios";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import { db, getEach } from "../apis/firebase";
import { COLOR, IPost, ITag, IDict } from "../custom";
import { useStore } from "../apis/useStore";
import { useRouter } from "next/router";
import { HiX } from "react-icons/hi";
import { useForm } from "react-hook-form";
import Color from "../components/atoms/Color";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import Modal from "../components/Modal";
import Motion from "../motions/Motion";
import IconBtn from "../components/atoms/IconBtn";
import { useFeedStore } from "../apis/useFeedStore";

interface IForm {
  file: File[];

  title: string;
  tags: string[];
  txt: string;
  color: string;
}

export default function Add() {
  const { gCurUser } = useStore();
  const { getPosts } = useFeedStore();
  const router = useRouter();
  const [prevPost, setPrevPost] = useState(
    router.query.post
      ? (JSON.parse(router.query.post as string) as IPost)
      : undefined
  );
  const [status, setStatus] = useState({
    selectedTab: prevPost ? (prevPost.imgs.length !== 0 ? true : false) : true,
    selectedColor: prevPost ? prevPost.color : COLOR.red,
  });
  const [preview, setPreview] = useState<string>(
    prevPost && prevPost.imgs.length !== 0 ? prevPost.imgs[0] : ""
  );
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(prevPost ? prevPost.tags : []);
  const [errors, setErrors] = useState({
    tags: "",
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<IForm>({
    defaultValues: {
      file: undefined,
      title: prevPost ? prevPost.title : "",
      txt: prevPost ? prevPost.txt : "",
      color: prevPost ? prevPost.color : COLOR.red,
      tags: prevPost ? prevPost.tags : [],
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  async function onValid(data: IForm) {
    if (confirm(`아카이브를 ${prevPost ? "수정" : "생성"}하시겠습니까?`)) {
      // 이미지인 경우
      if (status.selectedTab) {
        // 이미지를 올린 경우
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
            const deleteTags = await getEach<ITag>(
              "tags",
              prevPost.id as string
            );
            for (const tag of deleteTags) {
              await deleteDoc(doc(db, "tags", tag.id as string));
            }
            await updateDoc(doc(db, "posts", prevPost.id as string), {
              title: data.title,
              txt: data.txt,
              imgs: [res.data.url],
              color: data.color,
              tags,
            });
            pid = prevPost.id;
          }
          // 이미지를 올렸으며 등록인 경우
          else {
            const postRef = await addDoc(collection(db, "posts"), {
              uid: gCurUser.id,
              createdAt: serverTimestamp(),
              title: data.title,
              txt: data.txt,
              imgs: [res.data.url],
              color: data.color,
              tags,
            });
            await updateDoc(postRef, { id: postRef.id });
            pid = postRef.id;
          }
          for await (const tag of data.tags) {
            const tempTag: ITag = {
              uid: gCurUser.id,
              pid,
              name: tag,
            };
            const tagRef = await addDoc(collection(db, "tags"), tempTag);
            await updateDoc(tagRef, { id: tagRef.id });
          }
        } else {
          // 이미지를 올리지 않았으며 수정인 경우
          if (prevPost) {
            const deleteTags = await getEach<ITag>(
              "tags",
              prevPost.id as string
            );
            for (const tag of deleteTags) {
              await deleteDoc(doc(db, "tags", tag.id as string));
            }
            await updateDoc(doc(db, "posts", prevPost.id as string), {
              title: data.title,
              txt: data.txt,
              imgs: [...prevPost.imgs],
              color: data.color,
              tags,
            });
            for await (const tag of data.tags) {
              const tempTag: ITag = {
                uid: gCurUser.id,
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
      // 색깔인 경우
      else {
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
            uid: gCurUser.id,
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
            uid: gCurUser.id,
            pid: pid,
            name: tag,
          };
          const tagRef = await addDoc(collection(db, "tags"), tempTag);
          await updateDoc(tagRef, { id: tagRef.id });
        }
      }
      router.push({ pathname: "/", query: { refresh: true } });
    }
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
    setStatus({ ...status, selectedTab: !status.selectedTab });
  }
  function handleColorClick(color: string) {
    setValue("color", color);
    setStatus({ ...status, selectedColor: color });
  }
  function handleTagChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const newTag = e.target.value.split(" ")[0];
    if (newTag === " ") {
      setTag("");
    } else if (e.target.value.split(" ").length === 1) {
      if (newTag.length > 16) {
        return;
      }
      setTag(newTag);
    } else {
      if (tags.length === 5) {
        setErrors({
          ...errors,
          tags: "태그는 최대 5개까지 추가할 수 있습니다.",
        });
        return;
      }
      let tempTags = [...tags];
      const tagIndex = tempTags.findIndex((tempTag) => {
        return tempTag === newTag;
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
    }
    setErrors({
      ...errors,
      tags: "",
    });
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
  function checkKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && (e.target as HTMLElement).id !== "txt")
      e.preventDefault();
  }

  return (
    <Motion type="fade">
      <Modal show={isSubmitting} content={<></>} />
      <IconBtn
        type="back"
        onClick={() => {
          if (
            confirm(
              `아카이브 ${prevPost ? "수정" : "작성"}을 취소하시겠습니까?`
            )
          )
            router.back();
        }}
      />
      <form
        className="flex flex-col mt-4"
        onKeyDown={checkKeyDown}
        onSubmit={handleSubmit(
          (data) => onValid(data),
          (e: IDict<any>) => {
            for (const each in e) {
              if (each === "file") {
                imgRef.current?.focus();
              } else {
                e[each].ref.focus();
              }
              break;
            }
          }
        )}
      >
        <div className="flex justify-evenly">
          <div
            className={`w-full my-2 mr-1 hover:cursor-pointer button-${
              status.selectedTab ? "black" : "gray"
            }`}
            onClick={handleToggleClick}
          >
            이미지 업로드
          </div>
          <div
            className={`w-full my-2 ml-1 hover:cursor-pointer button-${
              !status.selectedTab ? "black" : "gray"
            }`}
            onClick={handleToggleClick}
          >
            배경색 선택
          </div>
        </div>
        {status.selectedTab ? (
          preview === "" ? (
            <div
              className="relative w-full pb-[100%] bg-gray-3 rounded-lg hover:cursor-pointer"
              onClick={handleImageClick}
              ref={imgRef}
              tabIndex={-1}
            >
              <div className="absolute top-[50%] left-[50%] text-6xl text-gray-2 font-thin -translate-x-[50%] -translate-y-[50%]">
                +
              </div>
            </div>
          ) : (
            <div
              className="relative w-full pb-[100%] overflow-hidden rounded-xl mb-2 hover:cursor-pointer"
              onClick={handleImageClick}
            >
              <Image src={preview} alt="" fill className="object-cover" />
            </div>
          )
        ) : (
          <div className="flex justify-between my-2">
            {["red", "orange", "yellow", "green", "blue", "navy", "purple"].map(
              (e) => (
                <Color
                  color={COLOR[e]}
                  onClick={() => handleColorClick(COLOR[e])}
                  selected={status.selectedColor === COLOR[e]}
                  key={e}
                />
              )
            )}
          </div>
        )}
        <input
          {...register("file", {
            required: status.selectedTab ? (prevPost ? false : true) : false,
          })}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={(e) => {
            file.ref(e);
            fileRef.current = e;
          }}
          id="file"
          hidden
        />

        <div className="inputForm">
          <label className="inputForm_label">제목 *</label>
          <div
            className={
              watch("title").length === 0
                ? "inputForm_txt inputForm_txt-invalid "
                : "inputForm_txt"
            }
          >{`${watch("title").length}/32`}</div>
        </div>
        <input
          {...register("title", { required: true, maxLength: 32 })}
          type="text"
          maxLength={32}
          id="title"
          className="inputForm_input"
        />

        <div className="inputForm">
          <div className="inputForm_left">
            <label className="mr-1 inputForm_label">태그</label>
            <div className="inputForm_txt">
              {errors["tags"] === "" ? `${tags.length}/5` : ""}
            </div>
          </div>
          <div
            className={
              tag.length === 0 || errors.tags !== ""
                ? "inputForm_txt inputForm_txt-invalid "
                : "inputForm_txt"
            }
          >
            {errors["tags"] === "" ? `${tag.length}/16` : errors["tags"]}
          </div>
        </div>
        <div className="flex flex-wrap">
          {watch("tags")?.map((each) => (
            <span
              className="flex my-1 mr-1 button-black w-fit hover:cursor-pointer"
              key={each}
            >
              <span className="mr-1">{each}</span>
              <span className="text-white" id={each} onClick={handleTagRemove}>
                <HiX />
              </span>
            </span>
          ))}
        </div>
        <input
          onChange={handleTagChange}
          value={tag}
          maxLength={17}
          id="tag"
          className="inputForm_input"
        />

        <div className="inputForm">
          <label className="inputForm_label">내용 *</label>
          <div
            className={
              watch("txt").length === 0
                ? "inputForm_txt inputForm_txt-invalid "
                : "inputForm_txt"
            }
          >{`${watch("txt").length}/2000`}</div>
        </div>

        <ReactTextareaAutosize
          {...register("txt", { required: true, maxLength: 2000 })}
          maxLength={2000}
          minRows={10}
          id="txt"
          className="h-32 resize-none inputForm_input"
        />
        <button className="button-black" type="submit">
          {prevPost ? "완료" : "생성"}
        </button>
      </form>
    </Motion>
  );
}
