import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../apis/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { AUTH_USER_DEFAULT } from "consts/auth";
import Login from "./pages/login/Login";
import { ProtectedRoute } from "routes";
import { UserProvider } from "contexts/UserProvider";
import { useCustomRouter } from "hooks";

type Props = {
  children: React.ReactNode;
};

type ILogin = {
  id: string;
  isLoggedIn: boolean | null;
};

export default function AuthProvider({ children }: Props) {
  const provider = new GoogleAuthProvider();

  const [login, setLogin] = useState<ILogin>({
    id: "",
    isLoggedIn: null,
  });

  const router = useCustomRouter();

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

  const getNewUser = (user: User) => {
    return {
      ...AUTH_USER_DEFAULT,
      id: user.uid,
      email: String(user.email),
      displayName: `아카이버-${user.uid.slice(0, 11)}`,
      createdAt: new Date(),
    };
  };

  const handleSocialLogin = () => {
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
  };

  return (
    <>
      {login.isLoggedIn === null ? (
        <></>
      ) : login.isLoggedIn ? (
        <UserProvider id={login.id}>
          <ProtectedRoute>{children}</ProtectedRoute>
        </UserProvider>
      ) : (
        <Login onSocialLogin={handleSocialLogin} />
      )}
    </>
  );
}
