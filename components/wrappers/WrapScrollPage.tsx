import { useRouter } from "next/router";
import React, { CSSProperties, useEffect, useRef } from "react";
import { useStatus } from "../../stores/useStatus";

interface IWrapScrollPageProps {
  children: React.ReactNode;
  path: string;
  className?: string;
  style?: CSSProperties;
}

export default function WrapScrollPage({
  children,
  path,
  className,
  style,
}: IWrapScrollPageProps) {
  const router = useRouter();
  const ref = useRef(null);

  const { scroll, setScroll } = useStatus();

  useEffect(() => {
    console.log(scroll[path]);
    if (scroll[path] !== 0)
      ref.current.querySelector(".ptr__children").scrollTo(0, scroll[path]);
  }, []);

  function onClick(e: React.MouseEvent<HTMLElement>) {
    console.log(
      "wrapScrollPage",
      path,
      scroll[path],
      ref.current?.querySelector(".ptr")?.scrollTop,
      ref.current,
      ref.current?.querySelector(".ptr")
    );
    e.preventDefault;
    setScroll(path, ref.current?.querySelector(".ptr__children")?.scrollTop);
  }

  return (
    <div onClick={onClick} className={className} style={style} ref={ref}>
      {children}
    </div>
  );
}
