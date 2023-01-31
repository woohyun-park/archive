import { useRouter } from "next/router";
import React from "react";
import { feedStore } from "../apis/feedStore";
import { useStore } from "../apis/zustand";

interface ILinkScroll {
  children: React.ReactNode;
}

export default function LinkScroll({ children }: ILinkScroll) {
  const { gSetScroll } = useStore();
  const router = useRouter();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    gSetScroll(router.pathname, window.scrollY);
  }
  return <div onClick={onClick}>{children}</div>;
}
