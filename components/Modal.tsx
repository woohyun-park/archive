import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
    return ReactDOM.createPortal(
      <AnimatePresence>
        {isVisible && (
          <WrapMotion
            type="fade"
            key={"modal"}
            className="w-full h-[100vh] fixed flex items-center justify-center"
          >
            {content}
          </WrapMotion>
        )}
      </AnimatePresence>,
      document.getElementById("modal-root") as Element
    );
  } else {
    return null;
  }
}
