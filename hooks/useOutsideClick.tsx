import { RefObject, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
interface IOutsideClick {
  ref: RefObject<any>;
  onClick: Function;
}

export const useOutsideAlerter = ({ ref, onClick }: IOutsideClick) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      console.log(ref.current, event.target);
      if (ref?.current && !ref?.current.contains(event.target)) {
        // alert("You clicked outside of me!");
        onClick();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};
