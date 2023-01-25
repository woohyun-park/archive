import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import { useForm } from "react-hook-form";
import Back from "../components/Back";
import Image from "next/image";
import { updateUser } from "../apis/firebase";
import { AnimatePresence, motion } from "framer-motion";
import MotionFade from "../motions/motionFade";
import BlockButton from "../components/atoms/BlockButton";

interface IForm {
  file: File[];
  displayName: string;
  txt: string;
}

export default function Setting() {
  const { gCurUser } = useStore();
  const [preview, setPreview] = useState(gCurUser.photoURL);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<IForm>({
    defaultValues: {
      file: undefined,
      displayName: gCurUser.displayName,
      txt: gCurUser.txt,
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function onValid(data: IForm) {
    if (gCurUser.photoURL === preview) {
      updateUser({
        id: gCurUser.id,
        displayName: data.displayName,
        txt: data.txt,
      });
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
      await axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
          formData,
          config
        )
        .then(async (res) => {
          updateUser({
            id: gCurUser.id,
            displayName: data.displayName,
            txt: data.txt,
            photoURL: res.data.url,
          });
        });
    }
    router.push(`/profile/${gCurUser.id}`);
  }
  function handleImageOnChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <>
      <MotionFade>
        {isSubmitting && (
          <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/20"></div>
        )}
        <Back />
        <div className="flex justify-center">
          <div className="relative object-cover w-24 h-24 overflow-hidden rounded-full">
            <Image
              src={preview}
              onClick={() => fileRef.current?.click()}
              alt=""
              fill
              className="object-cover"
            />
          </div>
        </div>
        <form
          className="flex flex-col mt-9"
          onSubmit={handleSubmit((data) => onValid(data))}
        >
          <input
            type="file"
            accept="image/*"
            {...register("file")}
            onChange={handleImageOnChange}
            ref={(e) => {
              file.ref(e);
              fileRef.current = e;
            }}
            hidden
          />
          <div className="inputForm">
            <label className="inputForm_label">사용자 이름</label>
            <div
              className={
                watch("displayName").length === 0
                  ? "inputForm_txt inputForm_txt-invalid "
                  : "inputForm_txt"
              }
            >{`${watch("displayName").length}/16`}</div>
          </div>
          <input
            {...register("displayName", { required: true, maxLength: 16 })}
            type="text"
            className="inputForm_input"
            maxLength={16}
          />
          <div className="inputForm">
            <label className="inputForm_label">소개</label>
            <div className="inputForm_txt">{`${watch("txt").length}/150`}</div>
          </div>
          <textarea
            {...register("txt", { maxLength: 150 })}
            maxLength={150}
            className="h-16 resize-none inputForm_input"
          />
          <BlockButton type="submit">변경</BlockButton>
        </form>
      </MotionFade>
    </>
  );
}
