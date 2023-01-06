import axios, { AxiosRequestConfig } from "axios";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { db } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, IUser } from "../custom";

export default function Setting() {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [newUser, setNewUser] = useState<IUser>(curUser);
  const [imageFile, setImageFile] = useState("");
  const router = useRouter();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    setNewUser({
      ...newUser,
      [name]: [value],
    });
  }
  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.currentTarget;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  }
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (imageFile === "") {
      setCurUser(newUser);
      updateCurUser(newUser);
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
      formData.append(`file`, imageFile);
      await axios
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CD_CLOUD_NAME}/image/upload`,
          formData,
          config
        )
        .then(async (res) => {
          setCurUser({ ...newUser, photoURL: res.data.url });
          updateCurUser({ ...newUser, photoURL: res.data.url });
        });
    }
    router.push(`/profile/${newUser.uid}`);
  }
  function handleImageClick() {
    imageInputRef.current?.click();
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files === null) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setNewUser({ ...newUser, photoURL: reader.result });
        setImageFile(reader.result);
      }
      e.target.value = "";
    };
  }

  const imageInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <h1>setting</h1>
      <div className="photoCont">
        <img
          className="photo"
          src={newUser.photoURL}
          onClick={handleImageClick}
        />
      </div>
      <form>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
        <input
          type="text"
          name="displayName"
          value={newUser.displayName}
          placeholder="이름"
          onChange={handleChange}
        />
        <textarea
          name="txt"
          value={newUser.txt}
          placeholder="소개"
          onChange={handleTextareaChange}
        />
        <button className="g-button1" onClick={handleSubmit}>
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
