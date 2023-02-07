import React, { useRef, useState } from "react";
import { COLOR, IPost, ITag, IDict } from "../libs/custom";
import { useRouter } from "next/router";
import { HiX } from "react-icons/hi";
import { useForm } from "react-hook-form";
import Color from "../components/atoms/Color";
import Image from "next/image";
import Modal from "../components/Modal";
import Motion from "../motions/Motion";
import IconBtn from "../components/atoms/IconBtn";
import { useUser } from "../stores/useUser";
import FormInput from "../components/atoms/FormInput";
import { handleColor, handleImage } from "../libs/formLib";

export interface IForm {
  file: File[];
  title: string;
  tags: string[];
  txt: string;
  color: string;
}

export default function Add() {
  const { curUser } = useUser();
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
      if (status.selectedTab)
        handleImage({ watch, prevPost, data, curUser, tags });
      // 색깔인 경우
      else handleColor({ prevPost, data, curUser, tags });
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
      <div className="flex">
        <IconBtn
          icon="back"
          onClick={() => {
            if (
              confirm(
                `아카이브 ${prevPost ? "수정" : "작성"}을 취소하시겠습니까?`
              )
            )
              router.back();
          }}
        />
      </div>
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
                  key={"add_color" + e}
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
        <FormInput
          watch={watch}
          register={register}
          type="text"
          name="title"
          txt="제목"
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
              key={"add_tag" + each}
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
        <FormInput
          type="textarea"
          watch={watch}
          register={register}
          name="txt"
          txt="내용"
          maxLength={2000}
        />
        <button className="button-black" type="submit">
          {prevPost ? "완료" : "생성"}
        </button>
      </form>
    </Motion>
  );
}
