import { useEffect, useRef } from "react";
import Motion from "../motions/Motion";

interface ILinkLoaderProps {
  href: string;
}

export default function LinkLoader({}: ILinkLoaderProps) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}
