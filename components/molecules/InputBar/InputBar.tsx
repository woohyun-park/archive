import { Icon, Input } from "components/atoms";
import { Ref, forwardRef, useRef } from "react";

import { AnimatePresence } from "framer-motion";
import { IIcon } from "components/atoms/Icon/Icon";
import { WrapMotionSlide } from "components/wrappers/motion";
import { twMerge } from "tailwind-merge";
import { useForwardRef } from "hooks";

type Props = {
  keyword: string;
  setKeyword: Function;
  isActive: boolean;
  setIsActive: (isSearching: boolean) => void;

  icon?: IIcon | "none";
  className?: string;
  refetch?: Function;
  onSubmit?: () => void;
};

const InputBar = (
  {
    keyword,
    setKeyword,
    isActive,
    setIsActive,

    icon = "none",
    className = "",
    refetch = () => {},
    onSubmit = () => {},
  }: Props,
  ref: Ref<HTMLDivElement>
) => {
  const forwardRef = useForwardRef<HTMLDivElement>(ref);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.currentTarget.value);
  };

  const handleClear = () => {
    setKeyword("");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === "Enter" && onSubmit();
  };

  const handleCancel = () => {
    setKeyword("");
    setIsActive(false);
  };

  const handleFocus = async () => {
    setIsActive(true);
    await refetch();
  };

  return (
    <div className={twMerge("flex", className)} ref={forwardRef}>
      <div className="w-full">
        <div className="relative flex items-center">
          <div className="absolute z-10 scale-75 left-1">
            {icon !== "none" && <Icon icon={icon} size="sm" />}
          </div>
          <div
            className={twMerge(
              "absolute z-10 scale-75 right-1",
              keyword === "" ? "invisible" : "visible"
            )}
            onClick={handleClear}
          >
            <Icon icon="x" size="sm" />
          </div>
          <Input
            type="text"
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            className={twMerge("w-full", icon !== "none" ? "px-7" : "px-2")}
            ref={inputRef}
          />
        </div>
      </div>
      <AnimatePresence>
        {isActive && (
          <WrapMotionSlide
            className="flex items-center justify-end w-12 hover:cursor-pointer"
            key="inputBar_cancel"
            direction="x"
            offset="48px"
            onClick={handleCancel}
          >
            취소
          </WrapMotionSlide>
        )}
      </AnimatePresence>
    </div>
  );
};

export default forwardRef<HTMLDivElement, Props>(InputBar);
