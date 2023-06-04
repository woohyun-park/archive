import { HTMLInputTypeAttribute, forwardRef } from "react";

import { twMerge } from "tailwind-merge";

type Props = {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: () => void;
  // autoFocus?: boolean;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    type = "text",
    value = "",
    placeholder = "",
    className = "",
    onChange = () => {},
    onKeyDown = () => {},
    onFocus = () => {},
  },
  ref
) {
  return (
    <input
      type={type}
      className={twMerge(
        "block px-2 py-2 my-1 text-base font-normal transition ease-in-out border-2 border-solid rounded-lg form-control text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none",
        className
      )}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      ref={ref}
    />
  );
});

export default Input;
