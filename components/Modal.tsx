import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { mergeTailwindClasses } from "../apis/tailwind";
import WrapMotion from "./wrappers/WrapMotion";

interface IModal {
  isVisible: boolean;
  content: ReactNode;
  className?: string;
}

export default function Modal({ isVisible, content, className }: IModal) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (isBrowser) {
    // if (isVisible) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "unset";
    // }
    return ReactDOM.createPortal(
      <AnimatePresence>
        {isVisible && (
          <WrapMotion type="fade" key={"modal"}>
            <div
              className={mergeTailwindClasses(
                "top-0 w-full max-w-[480px] h-[100vh] fixed bg-black/50",
                className || ""
              )}
            >
              {content}
            </div>
          </WrapMotion>
        )}
      </AnimatePresence>,
      document.getElementById("modal-root") as Element
    );
  } else {
    return null;
  }
}
