import { useRouter } from "next/router";
import React from "react";
import { useScrollSave } from "../../stores/useScrollSave";

interface IWrapScroll {
  children: React.ReactNode;
}

export default function WrapScroll({ children }: IWrapScroll) {
  const { setScroll } = useScrollSave();
  const router = useRouter();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(router.pathname, window.scrollY);
  }
  return <div onClick={onClick}>{children}</div>;
}
