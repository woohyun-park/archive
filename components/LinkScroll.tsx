import { useRouter } from "next/router";
import React from "react";
import useFeedState from "../apis/useFeedState";
import { useStore } from "../apis/zustand";

interface ILinkScroll {
  children: React.ReactNode;
}

export default function LinkScroll({ children }: ILinkScroll) {
  const router = useRouter();

  const { setScroll } = useFeedState();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(window.scrollY);
  }
  return <div onClick={onClick}>{children}</div>;
}
