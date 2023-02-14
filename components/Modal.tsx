import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

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
      return ReactDOM.createPortal(
        <div className="top-0 w-[100%] h-[100vh] fixed max-w-[480px] bg-black/50">
          {content}
        </div>,
        document.getElementById("modal-root") as Element
      );
    } else {
      document.body.style.overflow = "unset";
      return null;
    }
  } else {
    return null;
  }
}
