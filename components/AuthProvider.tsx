import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../apis/firebase/fb";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useCustomRouter } from "hooks";
import { UserProvider, useUser } from "contexts/UserProvider";
import Login from "./pages/login/Login";
import { ProtectRoute } from "routes/ProtectedRoute";
import Layout from "./common/Layout";
import { getNewUser } from "utils/auth";

type Props = {
  children: React.ReactNode;
};

type ILogin = {
  id: string;
  email: string;
  password: string;
  isNewAccount: boolean;
  isLoggedIn: boolean | null;
  error: string;
};

export default function AuthProvider({ children }: Props) {
  const provider = new GoogleAuthProvider();
  const router = useCustomRouter();
  const [login, setLogin] = useState<ILogin>({
    id: "",
    email: "",
    password: "",
    isNewAccount: false,
    isLoggedIn: null,
    error: "",
  });

  useEffect(() => {
    auth.onAuthStateChanged(async (authState) => {
      if (authState) {
        const id = authState.uid;
        setLogin({ ...login, id, isLoggedIn: true });
      } else {
        setLogin({ ...login, isLoggedIn: false });
      }
    });
  }, []);

  function handleSocialLogin() {
    signInWithPopup(auth, provider)
      .then(async ({ user }) => {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.data())
          await setDoc(doc(db, "users", user.uid), getNewUser(user));
        router.push("/");
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  return (
    <>
      {login.isLoggedIn === null ? (
        <></>
      ) : login.isLoggedIn ? (
        <UserProvider id={login.id}>
          <ProtectRoute>
            <Layout>{children}/</Layout>
          </ProtectRoute>
        </UserProvider>
      ) : (
        <Login onSocialLogin={handleSocialLogin} />
      )}
    </>
  );
}
