import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Nav from "./Nav";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const router = useRouter();
  function onLoginClick() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        setUser(user.uid);
      })
      .catch((error) => {});
  }
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // const [user, setUser] = useState<string | null>("null");
  const [user, setUser] = useState<string | null>("");
  return (
    <>
      {user === null ? (
        <div>
          <button onClick={onLoginClick}>login</button>
        </div>
      ) : (
        <>
          <div className="pageCont">{children}</div>
          <Nav />
        </>
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
            min-height: ${user === null ? "100vh" : "calc(100vh - 72px)"};
            background-color: white;
            box-sizing: border-box;
            display: ${user === null ? "flex" : ""};
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
