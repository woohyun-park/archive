import axios, { AxiosRequestConfig } from "axios";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import { COLOR, IUser } from "../custom";
import { useForm } from "react-hook-form";

interface IForm {
  file: File[];
  displayName: string;
  txt: string;
}

export default function Setting() {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [preview, setPreview] = useState(curUser.photoURL);

  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<IForm>({
    defaultValues: {
      file: undefined,
      displayName: curUser.displayName,
      txt: curUser.txt,
    },
  });
  const file = register("file");
  const fileRef = useRef<HTMLInputElement | null>(null);

  function onValid(data: IForm) {
    console.log("onValid");
    submit(data);
  }

  async function submit(data: IForm) {
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
  function handleImageClick() {
    fileRef.current?.click();
  }
  // function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   if (e.target.files === null) {
  //     return;
  //   }
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     if (typeof reader.result === "string") {
  //       setNewUser({ ...newUser, photoURL: reader.result });
  //       setPreview(reader.result);
  //     }
  //     e.target.value = "";
  //   };
  // }

  const imageInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <h1>setting</h1>
      <div className="photoCont">
        <img className="photo" src={preview} onClick={handleImageClick} />
      </div>
      <form onSubmit={handleSubmit((data) => onValid(data))}>
        <input
          type="file"
          accept="image/*"
          {...register("file")}
          onChange={(e) => {
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
          }}
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
        <textarea {...register("txt", { required: true })} placeholder="소개" />
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
