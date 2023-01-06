import { useRouter } from "next/router";
import { useState } from "react";
import { useStore } from "../apis/zustand";
import { COLOR, IUser } from "../custom";

export default function Setting() {
  const { curUser, setCurUser, updateCurUser } = useStore();
  const [newUser, setNewUser] = useState<IUser>(curUser);
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
  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setCurUser(newUser);
    updateCurUser(newUser);
    router.push(`/profile/${newUser.uid}`);
  }
  return (
    <>
      <h1>setting</h1>
      <form>
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
        <button className="createBtn" onClick={handleSubmit}>
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
          form > button {
            margin: 8px 0;
            background-color: ${COLOR.btn1};
            border: none;
            border-radius: 8px;
            padding: 8px;
            color: ${COLOR.txtDark1};
          }
        `}
      </style>
    </>
  );
}
