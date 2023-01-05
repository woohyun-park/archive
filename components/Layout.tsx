import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { auth } from "../apis/firebase";
import Nav from "./Nav";

interface ILayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean | null;
}

export default function Layout({ children, isLoggedIn }: ILayoutProps) {
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  function handleSocialLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log(user);
        // user.photoURL
        setUser(user.uid);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }
  async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  }
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState(auth.currentUser);
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      {isLoggedIn === null ? (
        <>loading...</>
      ) : isLoggedIn ? (
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
              value={email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              required
              value={password}
              onChange={handleChange}
            />
            <input
              type="submit"
              value={newAccount ? "create account" : "login"}
              required
            />
          </form>
          <button onClick={() => setNewAccount(!newAccount)}>
            {newAccount ? "Log In" : "Create Account"}
          </button>
          <button onClick={handleSocialLogin}>login with google</button>
          {error}
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
            min-height: ${isLoggedIn ? "calc(100vh - 72px)" : "100vh"};
            background-color: white;
            box-sizing: border-box;
            display: ${isLoggedIn ? "" : "flex"};
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
