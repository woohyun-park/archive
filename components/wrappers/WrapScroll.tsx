import { useRouter } from "next/router";
import React, { CSSProperties } from "react";
import { useStatus } from "../../stores/useStatus";

interface IWrapScroll {
  children: React.ReactNode;
  path?: string;
  className?: string;
  style?: CSSProperties;
}

export default function WrapScroll({
  children,
  path,
  className,
  style,
}: IWrapScroll) {
  const { setScroll } = useStatus();
  const router = useRouter();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    console.log(e.target);
    console.log(path);
    setScroll(path ? path : router.asPath, window.scrollY);
  }
  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
}
