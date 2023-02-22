import React, { useEffect, useRef } from "react";
import { useStatus } from "../../stores/useStatus";

// Tab이 존재하는 route에 대해서 tab마다 다르게 scroll 위치를 저장하도록 도와주는 wrapper

// children: 클릭 했을때 scroll 위치를 저장하도록 wrap하고자하는 하위요소
// children에는 refScroll이라는 id를 가진 scrollable element가 존재해야 한다.

// path: scroll에 저장하고자 하는 key. (e.g. router.asPath + "/" + tabNum)

interface IWrapScrollTabProps {
  children: React.ReactNode;
  path: string;
}

export default function WrapScrollTab({ children, path }: IWrapScrollTabProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scroll, setScroll } = useStatus();

  // 만약 scroll에 저장되어있는 값이 있다면 해당 위치로 #refScroll을 scroll한다.
  useEffect(() => {
    if (scroll[path] !== 0)
      ref.current?.querySelector("#refScroll")?.scrollTo(0, scroll[path]);
  }, []);

  // children의 아무 부분을 클릭하면 refScroll의 scrollY 위치를 scroll에 저장한다.
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(path, ref.current?.querySelector("#refScroll")?.scrollTop || 0);
  }

  return (
    <div onClick={onClick} ref={ref}>
      {children}
    </div>
  );
}
