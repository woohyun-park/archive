import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { auth } from "../apis/firebase";

import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
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
