import { RefObject, useEffect } from "react";

export default function useOutsideClick<T>(
  ref: RefObject<HTMLElement>,
  fn: Function
) {
  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        fn();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, fn]);

  return ref;
}
