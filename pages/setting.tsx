import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import { COLOR, IUser, SIZE } from "../custom";
import { useForm } from "react-hook-form";
import { HiArrowLeft } from "react-icons/hi";

interface IForm {
  file: File[];
  displayName: string;
  txt: string;
}

export default function Setting() {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [preview, setPreview] = useState(curUser.photoURL);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
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
      const tempUser = {
        ...curUser,
        displayName: data.displayName,
        txt: data.txt,
      };
      setCurUser(tempUser);
      updateCurUser(tempUser);
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
          const tempUser = {
            ...curUser,
            displayName: data.displayName,
            txt: data.txt,
            photoURL: res.data.url,
          };
          setCurUser(tempUser);
          updateCurUser(tempUser);
        });
    }
    router.push(`/profile/${curUser.uid}`);
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
      {isSubmitting && <div className="submitting"></div>}
      <div className="back" onClick={() => router.back()}>
        <HiArrowLeft size={SIZE.icon} />
      </div>
      <div className="photoCont">
        <img
          className="photo"
          src={preview}
          onClick={() => fileRef.current?.click()}
        />
      </div>
      <form onSubmit={handleSubmit((data) => onValid(data))}>
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
        <input
          {...register("displayName", { required: true, maxLength: 16 })}
          type="text"
          placeholder="이름"
        />
        <textarea {...register("txt", { maxLength: 150 })} placeholder="소개" />
        <button type="submit" className="g-button1">
          변경
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
            height: 64px;
            resize: none;
          }
          .submitting {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
          }
          .photoCont {
            text-align: center;
          }
          .photo {
            border-radius: 72px;
            width: 96px;
            height: 96px;
            object-fit: cover;
          }
        `}
      </style>
    </>
  );
}
