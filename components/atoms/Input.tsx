import { HTMLInputTypeAttribute } from "react";

interface IInputProps {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  ref?: React.LegacyRef<HTMLInputElement>;
  autoFocus?: boolean;
  style?: string;
}

export default function Input({
  type = "text",
  value,
  placeholder,
  onChange,
  onKeyDown,
  ref,
  autoFocus,
  style,
}: IInputProps) {
  return (
    <>
      <input
        type={type}
        className="block w-full px-2 py-2 my-1 text-base font-normal transition ease-in-out border-2 border-solid rounded-lg form-control text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        ref={ref}
        autoFocus={autoFocus}
        id="input_i1"
      />

      <style jsx>
        {`
          #input_i1 {
            ${style}
          }
        `}
      </style>
    </>
  );
}
