import { RefObject, useEffect } from "react";
import { IUser } from "../custom";

/**
 * Hook that alerts clicks outside of the passed ref
 */
interface IOutsideClick {
  ref: RefObject<any>;
  onClick: Function;
}

export const useOutsideClick = ({ ref, onClick }: IOutsideClick) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref?.current && !ref?.current.contains(event.target)) {
        onClick();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};
