import { useRouter } from "next/router";
import React from "react";
import { feedStore } from "../apis/feedStore";
import { useStore } from "../apis/zustand";

interface ILinkScroll {
  children: React.ReactNode;
  isVisible: boolean;
}

export default function LinkScroll({
  children,
  isVisible = true,
}: ILinkScroll) {
  const { setScroll } = feedStore();
  function onClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault;
    setScroll(window.scrollY);
  }
  return (
    <>
      <div
        className={
          isVisible
            ? "duration-300 max-h-[1000px] ease-in-out origin-top"
            : "duration-300 max-h-[0px] ease-in-out origin-top opacity-0"
        }
      >
        <div onClick={onClick} className="duration-1000 ease-in-out origin-top">
          {children}
        </div>
      </div>
    </>
  );
}
