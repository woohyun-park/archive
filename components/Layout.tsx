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
import { DEFAULT, IUser } from "../custom";

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
  const { user, setUser } = useStore();
  const [login, setLogin] = useState<ILogin>({
    email: "",
    password: "",
    isNewAccount: false,
    isLoggedIn: null,
    error: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged(async (curUser) => {
      if (curUser) {
        const snap = await getDoc(doc(db, "users", curUser.uid));
        const profile: IUser = snap.data() as IUser;
        setLogin({ ...login, isLoggedIn: true });
        setUser({
          ...profile,
          uid: curUser.uid,
        });
      } else {
        setLogin({ ...login, isLoggedIn: false });
      }
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "email") {
      setLogin({ ...login, email: value });
    } else if (name === "password") {
      setLogin({ ...login, password: value });
    }
  }
  function handleSocialLogin() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        const res = await setDoc(doc(db, "users", user.uid), {
          displayName: user.displayName,
          photoURL: user.photoURL,
          txt: "",
          posts: [],
          tags: [],
          scraps: [],
          followers: [],
          followings: [],
        });
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      let data;
      if (login.isNewAccount) {
        const res = await createUserWithEmailAndPassword(
          auth,
          login.email,
          login.password
        );
        await setDoc(doc(db, "users", res.user.uid), {
          displayName: res.user.email,
          photoURL: DEFAULT.user.photoURL,
          txt: "",
          posts: [],
          tags: [],
          scraps: [],
          followers: [],
          followings: [],
        });
      } else {
        await signInWithEmailAndPassword(auth, login.email, login.password);
      }
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
          <div className="pageCont">{children}</div>
          <Nav />
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
            background-color: #d9d9d9;
          }
          body {
            margin: 0;
            width: 100vw;
            max-width: 480px;
            min-height: ${login.isLoggedIn ? "calc(100vh - 72px)" : "100vh"};
            background-color: white;
            box-sizing: border-box;
            display: ${login.isLoggedIn ? "" : "flex"};
            justify-content: center;
            align-items: center;
          }
          body::-webkit-scrollbar {
            display: none;
          }
          .pageCont {
            padding: 16px;
            padding-top: ${router.pathname.split("/")[1] === "post"
              ? "0"
              : "48px"};
            padding-bottom: 96px;
          }
        `}
      </style>
    </>
  );
}
