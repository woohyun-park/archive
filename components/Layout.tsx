import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import { auth, db } from "../apis/firebase";
import Nav from "./Nav";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { COLOR, DEFAULT, IUser } from "../custom";

interface ILayoutProps {
  children: React.ReactNode;
}

interface ILogin {
  email: string;
  password: string;
  isNewAccount: boolean;
  isLoggedIn: boolean | null;
  error: string;
}

export default function Layout({ children }: ILayoutProps) {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const { gCurUser, gSetCurUser, gSetPostsAndUsers } = useStore();
  const [login, setLogin] = useState<ILogin>({
    email: "",
    password: "",
    isNewAccount: false,
    isLoggedIn: null,
    error: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged(async (authState) => {
      if (authState) {
        const snap = await getDoc(doc(db, "users", authState.uid));
        setLogin({ ...login, isLoggedIn: true });
        const tempUser = await gSetCurUser({ id: authState.uid });
        await gSetPostsAndUsers(tempUser, 5);
      } else {
        setLogin({ ...login, isLoggedIn: false });
      }
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  }
  function handleSocialLogin() {
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const user = res.user;
        const tempUser: IUser = {
          ...DEFAULT.user,
          id: user.uid,
          email: String(user.email),
          displayName: `아카이버-${user.uid.slice(0, 11)}`,
        };
        await setDoc(doc(db, "users", user.uid), tempUser);
        router.push("/");
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (login.isNewAccount) {
        const res = await createUserWithEmailAndPassword(
          auth,
          login.email,
          login.password
        );
        const user = res.user;
        const tempUser: IUser = {
          ...DEFAULT.user,
          id: user.uid,
          email: String(user.email),
          displayName: `아카이버-${user.uid.slice(0, 11)}`,
        };
        await setDoc(doc(db, "users", user.uid), tempUser);
      } else {
        await signInWithEmailAndPassword(auth, login.email, login.password);
      }
      router.push("/");
    } catch (e) {
      if (e instanceof Error) {
        setLogin({ ...login, error: e.message });
      }
    }
  }

  return (
    <>
      {login.isLoggedIn === null ? (
        <>loading...</>
      ) : login.isLoggedIn ? (
        <>
          <div className="g-pageCont">{children}</div>
          {router.pathname === "/setting" || router.pathname === "/add" ? (
            <></>
          ) : (
            <Nav />
          )}
        </>
      ) : (
        <div>
          <form onSubmit={handleEmailLogin}>
            <input
              type="text"
              name="email"
              placeholder="email"
              required
              value={login.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              required
              value={login.password}
              onChange={handleChange}
            />
            <input
              type="submit"
              value={login.isNewAccount ? "create account" : "login"}
              required
            />
          </form>
          <button
            onClick={() =>
              setLogin({ ...login, isNewAccount: !login.isNewAccount })
            }
          >
            {login.isNewAccount ? "Log In" : "Create Account"}
          </button>
          <button onClick={handleSocialLogin}>login with google</button>
          {login.error}
        </div>
      )}

      <style jsx global>
        {`
          :root {
            display: flex;
            justify-content: center;
            width: 100%;
            background-color: ${COLOR.bg2};
          }
          body {
            margin: 0;
            width: 100vw;
            max-width: 480px;
            min-height: ${!login.isLoggedIn
              ? "100vh"
              : router.pathname === "/setting" || router.pathname === "/add"
              ? "100vh"
              : "calc(100vh - 72px)"};
            max-height: ${router.pathname === "/setting" ? "100vh" : ""};
            background-color: white;
            box-sizing: border-box;
            display: ${login.isLoggedIn ? "" : "flex"};
            justify-content: center;
            align-items: center;
          }
          body::-webkit-scrollbar {
            display: none;
          }
          .g-pageCont {
            padding: 16px;
            padding-top: ${router.pathname.split("/")[1] === "post"
              ? "0"
              : "48px"};
            padding-bottom: ${router.pathname === "/setting" ||
            router.pathname === "/add"
              ? ""
              : "96px"};
          }
          .g-button1 {
            margin: 8px 0;
            background-color: ${COLOR.btn1};
            border: none;
            border-radius: 8px;
            padding: 8px;
            color: ${COLOR.txtDark1};
            width: 100%;
            font-size: 16px;
          }
          .g-button2 {
            margin: 8px 0;
            background-color: ${COLOR.btn2};
            border: none;
            border-radius: 8px;
            padding: 8px;
            color: ${COLOR.txtDark2};
            width: 100%;
            font-size: 16px;
          }
          .g-profileImg {
            position: relative;
            overflow: hidden;
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 8px;
          }
          .g-button1:hover,
          .g-button2:hover {
            cursor: pointer;
          }

          .g_input_labelCont {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .g_input_label {
            font-size: 16px;
            margin-top: 8px;
          }
          .g_input_txtLen {
            font-size: 12px;
          }
          .g_input_txtLen-invalid {
            color: red;
          }

          .g-hover:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}
