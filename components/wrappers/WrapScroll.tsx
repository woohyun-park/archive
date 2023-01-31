import { useRouter } from "next/router";
import React from "react";
import { useStore } from "../../apis/useStore";

interface IWrapScroll {
  children: React.ReactNode;
}

export default function WrapScroll({ children }: IWrapScroll) {
  const { gSetScroll } = useStore();
  const router = useRouter();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    gSetScroll(router.pathname, window.scrollY);
  }
  return <div onClick={onClick}>{children}</div>;
}
