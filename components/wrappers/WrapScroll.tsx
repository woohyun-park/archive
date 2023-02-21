import { useRouter } from "next/router";
import React, { CSSProperties, useEffect, useRef } from "react";
import { useStatus } from "../../stores/useStatus";

interface IWrapScroll {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function WrapScroll({
  children,
  className,
  style,
}: IWrapScroll) {
  const { setScroll } = useStatus();
  const router = useRouter();

  function onClick(e: React.MouseEvent<HTMLElement>) {
    console.log("wrapScroll");
    e.preventDefault;
    setScroll(router.asPath, window.scrollY);
  }
  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
}
