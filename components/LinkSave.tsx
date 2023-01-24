import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useStore } from "../apis/zustand";
import { getRoute, IRoute, IType } from "../custom";

interface ILinkSave {
  //   href: string;
  //   route: IRoute;
  type: IType;
  children: React.ReactNode;
}

export default function LinkSave({ type, children }: ILinkSave) {
  const router = useRouter();
  const route = getRoute(router);
  const { gSetScroll } = useStore();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    if (route === "feed") {
      console.log("setScroll!!!!!!!", window.scrollY);
      gSetScroll(route, type, window.scrollY);
    }
  }
  return (
    <>
      <div onClick={onClick}>{children}</div>
    </>
  );
}
