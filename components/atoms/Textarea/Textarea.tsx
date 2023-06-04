import ReactTextareaAutosize from "react-textarea-autosize";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
type Props = {
  value?: string;
  placeholder?: string;
  autoFocus?: boolean;
  minRows?: number;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  {
    value = "",
    placeholder = "",
    autoFocus = false,
    minRows = 5,
    className = "",
    onChange = () => {},
  },
  ref
) {
  return (
    <ReactTextareaAutosize
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      minRows={minRows}
      ref={ref}
      autoFocus={autoFocus}
      className={twMerge(
        "block w-full h-8 px-2 py-2 text-base leading-5 transition ease-in-out border-2 border-solid rounded-lg resize-none text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none",
        className
      )}
    />
  );
});

export default Textarea;
