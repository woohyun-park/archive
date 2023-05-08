import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => storePathValues, [router.asPath]);

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;
    const prevPath = storage.getItem("currentPath");
    storage.setItem("prevPath", prevPath || "");
    storage.setItem("currentPath", globalThis.location.pathname);
  }

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout>
          {/*
        TODO: framer-motion router간 exit animation이 동작하지 않는 이슈
        스레드 참조: [BUG] Exit animation with Next.js #1375
        */}
          <AnimatePresence>
            <Component {...pageProps} />
          </AnimatePresence>
        </Layout>
      </QueryClientProvider>
    </>
  );
}
