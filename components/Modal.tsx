import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import WrapMotion from "./wrappers/WrapMotion";

interface IModal {
  isVisible: boolean;
  content: ReactNode;
}

export default function Modal({ isVisible, content }: IModal) {
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
            <div className="top-0 w-[100%] h-[100vh] fixed max-w-[480px] bg-black/50">
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
