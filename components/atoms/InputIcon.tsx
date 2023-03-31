import { AnimatePresence } from "framer-motion";
import { SIZE } from "../../apis/interface";
import BtnIcon from "./BtnIcon";
import { ChangeEvent, forwardRef, MouseEvent } from "react";
import WrapMotion from "../wrappers/WrapMotion";

interface IInputIconProps {
  icon: "filter" | "search";
  keyword: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (e: MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: string;
}

export default forwardRef<HTMLInputElement, IInputIconProps>(function InputIcon(
  { icon, onChange, onDelete, onKeyDown, keyword, placeholder, style },
  ref
) {
  return (
    <>
      <div className="relative flex items-center py-2 mt-4" id="iconInput_d1">
        <div className="absolute z-10 scale-75 left-1">
          <BtnIcon icon={icon} size={SIZE.iconSm} />
        </div>
        {keyword && keyword.length !== 0 && (
          <div className="absolute z-10 scale-75 right-1" onClick={onDelete}>
            <BtnIcon icon={"x"} size={SIZE.iconSm} />
          </div>
        )}
        <AnimatePresence>
          <WrapMotion type="fade" className="top-0 z-0 w-full">
            <input
              type="text"
              placeholder={placeholder}
              value={keyword}
              onChange={onChange}
              onKeyDown={onKeyDown}
              className="input-base"
              style={{
                paddingLeft: "1.625rem",
                paddingRight: "1.625rem",
                fontSize: "0.875rem",
              }}
              ref={ref}
            />
          </WrapMotion>
        </AnimatePresence>
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
