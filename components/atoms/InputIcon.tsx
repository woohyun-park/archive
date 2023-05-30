import { AnimatePresence } from "framer-motion";
import { SIZE } from "../../apis/def";
import BtnIcon from "./BtnIcon";
import { ChangeEvent, FocusEventHandler, forwardRef, MouseEvent } from "react";
import WrapMotion from "../wrappers/motion/WrapMotionFloat";
import { mergeTailwindClasses } from "apis/tailwind";

interface IInputIconProps {
  icon: "filter" | "search";
  keyword: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: (e: MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  style?: string;
}

export default forwardRef<HTMLInputElement, IInputIconProps>(function InputIcon(
  {
    icon,
    onChange,
    onClear,
    onKeyDown,
    onFocus,
    keyword,
    placeholder,
    className,
    style,
  },
  ref
) {
  return (
    <>
      <div
        className={mergeTailwindClasses(
          "relative flex items-center",
          className || ""
        )}
        id="iconInput_d1"
      >
        <div className="absolute z-10 scale-75 left-1">
          <BtnIcon icon={icon} size={SIZE.iconSm} />
        </div>
        {keyword && keyword.length !== 0 && (
          <div className="absolute z-10 scale-75 right-1" onClick={onClear}>
            <BtnIcon icon={"x"} size={SIZE.iconSm} />
          </div>
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={keyword}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          className="input-base"
          style={{
            paddingLeft: "1.625rem",
            paddingRight: "1.625rem",
            fontSize: "0.875rem",
          }}
          ref={ref}
        />
      </div>
      <style jsx>
        {`
          #iconInput_d1 {
            ${style}
          }
        `}
      </style>
    </>
  );
});
