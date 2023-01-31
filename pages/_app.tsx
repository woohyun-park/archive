import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useStore } from "../apis/useStore";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Layout>
        {/*
        TODO: framer-motion router간 exit animation이 동작하지 않는 이슈
        스레드 참조: [BUG] Exit animation with Next.js #1375
        */}
        <AnimatePresence>
          <Component {...pageProps} key={router.pathname} />
        </AnimatePresence>
      </Layout>
    </>
  );
}
