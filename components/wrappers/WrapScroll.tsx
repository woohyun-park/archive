import { useRouter } from "next/router";
import React from "react";
import { useStatus } from "../../stores/useStatus";

interface IWrapScroll {
  children: React.ReactNode;
  className?: string;
}

export default function WrapScroll({ children, className }: IWrapScroll) {
  const { setScroll } = useStatus();
  const router = useRouter();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(router.asPath, window.scrollY);
  }
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
}
