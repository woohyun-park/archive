import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import { COLOR, IDict, IUser, SIZE } from "../custom";
import { useForm } from "react-hook-form";
import { HiArrowLeft, HiX } from "react-icons/hi";

interface IForm {
  file: File[];
  displayName: string;
  txt: string;
}

export default function Setting() {
  const { curUser, setCurUser } = useStore();
  const [preview, setPreview] = useState(curUser.photoURL);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
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
      setCurUser({
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
          setCurUser({
            id: curUser.id,
            displayName: data.displayName,
            txt: data.txt,
            photoURL: res.data.url,
          });
        });
    }
    router.push(`/profile/${curUser.id}`);
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
        <div className="labelCont">
          <label className="label">사용자 이름</label>
          <div
            className={
              watch("displayName").length === 0
                ? "txtLen txtLen-invalid "
                : "txtLen"
            }
          >{`${watch("displayName").length}/16`}</div>
        </div>
        <input
          {...register("displayName", { required: true, maxLength: 16 })}
          type="text"
          maxLength={16}
        />
        <div className="labelCont">
          <label className="label">소개</label>
          <div className="txtLen">{`${watch("txt").length}/150`}</div>
        </div>
        <textarea {...register("txt", { maxLength: 150 })} maxLength={150} />
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
          .labelCont {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .label {
            font-size: 16px;
            margin-top: 8px;
          }
          .txtLen {
            font-size: 12px;
          }
          .txtLen-invalid {
            color: red;
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
