import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { auth } from "../apis/firebase";
import { useStore } from "../apis/store";

import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { userState, setUserState } = useStore();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserState(user);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);
  return (
    <>
      <Layout isLoggedIn={isLoggedIn}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
