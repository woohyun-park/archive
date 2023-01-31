import { useRouter } from "next/router";
import React from "react";
import { feedStore } from "../apis/feedStore";
import { useStore } from "../apis/zustand";

interface ILinkScroll {
  children: React.ReactNode;
}

export default function LinkScroll({ children }: ILinkScroll) {
  const { setScroll } = feedStore();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(window.scrollY);
  }
  return (
    <>
      <div onClick={onClick}>{children}</div>
    </>
  );
}
