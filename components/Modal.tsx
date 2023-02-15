import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Motion from "../motions/Motion";

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
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return ReactDOM.createPortal(
      <AnimatePresence>
        {isVisible && (
          <Motion type="fade" key={"modal"}>
            <div className="top-0 w-[100%] h-[100vh] fixed max-w-[480px] bg-black/50">
              {content}
            </div>
          </Motion>
        )}
      </AnimatePresence>,
      document.getElementById("modal-root") as Element
    );
  } else {
    return null;
  }
}
