import { useRouter } from "next/router";
import React from "react";
import { useScrollSave } from "../../stores/useScrollSave";

interface IWrapScroll {
  children: React.ReactNode;
  className?: string;
}

export default function WrapScroll({ children, className }: IWrapScroll) {
  const { setScroll } = useScrollSave();
  const router = useRouter();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(router.pathname, window.scrollY);
  }
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
}
