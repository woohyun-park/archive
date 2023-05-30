import React, { useRef, useState } from "react";
import { auth, updateUser } from "../apis/firebase";
import axios, { AxiosRequestConfig } from "axios";

import Btn from "../components/atoms/Btn";
import BtnIcon from "../components/atoms/BtnIcon";
import FormInput from "../components/atoms/FormInput";
import ProfileImg from "../components/ProfileImg";
import { WrapMotionFade } from "components/wrappers/motion";
import { signOut } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useStatus } from "../stores/useStatus";
import { useUser } from "providers";
import { wrapPromise } from "../libs/common";

interface IForm {
  file: File[];
  displayName: string;
  txt: string;
}

export default function Setting() {
  const { data: curUser } = useUser();
  const [preview, setPreview] = useState(curUser.photoURL);
  const { setLogoutLoader } = useStatus();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm<IForm>({
    defaultValues: {
      file: undefined,
      displayName: curUser.displayName,
      txt: curUser.txt,
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function onValid(data: IForm) {
    if (curUser.photoURL === preview) {
      updateUser({
        id: curUser.id,
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
            id: curUser.id,
            displayName: data.displayName,
            txt: data.txt,
            photoURL: res.data.url,
          });
        });
    }
    router.replace(`/profile/${curUser.id}`);
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

  function handleFileClick() {
    fileRef.current?.click();
  }

  return (
    <WrapMotionFade className="m-4">
      {isSubmitting && (
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/20"></div>
      )}
      <div className="flex justify-between mb-4">
        <BtnIcon
          icon="back"
          onClick={() => {
            if (isDirty) {
              if (confirm(`프로필 수정을 취소하시겠습니까?`)) router.back();
            } else router.back();
          }}
        />
        <div
          className="flex items-center text-xs hover:cursor-pointer w-fit"
          onClick={async () => {
            await wrapPromise(() => setLogoutLoader(true), 1000);
            signOut(auth);
            router.reload();
            // router.replace("/");
          }}
        >
          로그아웃
        </div>
      </div>
      <div className="flex flex-col items-center">
        <ProfileImg size="lg" photoURL={preview} onClick={handleFileClick} />
        <div
          className="mt-2 text-xs hover:cursor-pointer"
          onClick={handleFileClick}
        >
          사진 수정
        </div>
      </div>
      <form
        className="flex flex-col mt-4"
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
        <FormInput
          watch={watch}
          register={register}
          type="text"
          name="displayName"
          label="사용자 이름"
          maxLength={16}
        />
        <FormInput
          watch={watch}
          register={register}
          type="textarea"
          name="txt"
          label="소개"
          maxLength={150}
          minRows={4}
        />
        <Btn label="변경" type="submit" />
      </form>
    </WrapMotionFade>
  );
}
