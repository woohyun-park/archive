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
import { COLOR, DEFAULT, IUser, SIZE } from "../custom";
import {
  RiAppleFill,
  RiFacebookFill,
  RiGoogleFill,
  RiKakaoTalkFill,
} from "react-icons/ri";
import { IconBase } from "react-icons";

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
  const { gInit } = useStore();
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
        await gInit(authState.uid);
        setLogin({ ...login, isLoggedIn: true });
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
        <div className="flex flex-col items-center">
          <form onSubmit={handleEmailLogin} className="flex flex-col w-80">
            <input
              type="text"
              name="email"
              placeholder="Email"
              required
              value={login.email}
              onChange={handleChange}
              className="my-1 button-gray"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={login.password}
              onChange={handleChange}
              className="my-1 button-gray"
            />
            <input
              type="submit"
              value={login.isNewAccount ? "Create Account" : "Login"}
              required
              className="mt-2 button-black"
            />
          </form>
          <button
            onClick={() =>
              setLogin({ ...login, isNewAccount: !login.isNewAccount })
            }
            className="block w-full my-1 text-right text-gray-2"
          >
            {login.isNewAccount ? "Log In" : "Create Account"}
          </button>
          {!login.isNewAccount && (
            <div>
              <button
                className="p-1 m-2 text-white bg-black rounded-full"
                onClick={handleSocialLogin}
              >
                <RiGoogleFill size={SIZE.icon} />
              </button>
              <button
                className="p-1 m-2 text-white rounded-full bg-gray-2"
                onClick={handleSocialLogin}
                disabled
              >
                <RiAppleFill size={SIZE.icon} />
              </button>
              <button
                className="p-1 m-2 text-white rounded-full bg-gray-2"
                onClick={handleSocialLogin}
                disabled
              >
                <RiFacebookFill size={SIZE.icon} />
              </button>
            </div>
          )}
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
        `}
      </style>
    </>
  );
}
