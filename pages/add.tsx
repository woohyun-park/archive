import React, { useRef, useState } from "react";
import { COLOR, IPost, IDict } from "../libs/custom";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Image from "next/image";
import WrapMotion from "../components/wrappers/WrapMotion";
import BtnIcon from "../components/atoms/BtnIcon";
import { useUser } from "../stores/useUser";
import FormInput from "../components/atoms/FormInput";
import { handleColor, handleImage } from "../libs/formLib";
import { useFormTag } from "../hooks/useFormTag";
import FormTag from "../components/atoms/FormTag";
import ColorBox from "../components/atoms/ColorBox";
import { useFeed } from "../stores/useFeed";

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
  const prevPost = router.query.post
    ? (JSON.parse(router.query.post as string) as IPost)
    : undefined;
  const [status, setStatus] = useState({
    selectedTab: prevPost ? (prevPost.imgs.length !== 0 ? true : false) : true,
    selectedColor: prevPost ? prevPost.color : COLOR.red,
  });
  const [preview, setPreview] = useState<string>(
    prevPost && prevPost.imgs.length !== 0 ? prevPost.imgs[0] : ""
  );
  const { tag, tags, error, onChange, onDelete } = useFormTag(
    prevPost ? prevPost.tags : []
  );
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
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { setRefresh } = useFeed();

  async function onValid(data: IForm) {
    if (confirm(`아카이브를 ${prevPost ? "수정" : "생성"}하시겠습니까?`)) {
      // 이미지인 경우
      if (status.selectedTab)
        await handleImage({ watch, prevPost, data, curUser, tags });
      // 색깔인 경우
      else await handleColor({ prevPost, data, curUser, tags });
      setRefresh(true);
      router.push({ pathname: "/" });
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
  function checkKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Enter" && (e.target as HTMLElement).id !== "txt")
      e.preventDefault();
  }

  return (
    <WrapMotion type="fade">
      <div className="flex">
        <BtnIcon
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
              className="relative w-full pb-[100%] bg-gray-3 rounded-lg hover:cursor-pointer mb-4"
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
              className="relative w-full pb-[100%] overflow-hidden rounded-xl mb-4 hover:cursor-pointer"
              onClick={handleImageClick}
            >
              <Image src={preview} alt="" fill className="object-cover" />
            </div>
          )
        ) : (
          <ColorBox
            selectedColor={status.selectedColor}
            setSelectedColor={(color: string) => handleColorClick(color)}
          />
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
          label="제목"
        />
        <FormTag
          tag={tag}
          tags={tags}
          error={error}
          onChange={onChange}
          onDelete={onDelete}
        />
        <FormInput
          type="textarea"
          watch={watch}
          register={register}
          name="txt"
          label="내용"
          maxLength={2000}
        />
        <button className="button-black" type="submit">
          {prevPost ? "완료" : "생성"}
        </button>
      </form>
    </WrapMotion>
  );
}
