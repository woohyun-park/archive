import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { auth } from "../apis/firebase";
import { useStore } from "../apis/zustand";

import Layout from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
