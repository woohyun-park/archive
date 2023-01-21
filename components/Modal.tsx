import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface IModal {
  show: boolean;
  content: ReactNode;
}

export default function Modal({ show, content }: IModal) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (isBrowser) {
    if (show) {
      document.body.style.overflow = "hidden";
      return ReactDOM.createPortal(
        <div className="top-0 left-0 w-[100vw] h-[100vh] fixed bg-black/50">
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
