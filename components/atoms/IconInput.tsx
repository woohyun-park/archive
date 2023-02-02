import { motion, Variants } from "framer-motion";
import { HTMLInputTypeAttribute, Ref } from "react";
interface IIconInputProps {
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  variants?: Variants;
  ref?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
  style?: string;
}

export default function IconInput({
  type,
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  variants,
  ref,
  autoFocus,
  style,
}: IIconInputProps) {
  return (
    <>
      <motion.input
        type={type}
        className="block w-full px-2 py-1 my-1 text-base font-normal border-2 border-solid rounded-lg form-control text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        initial="initial"
        animate="animate"
        whileFocus="whileFocus"
        exit="exit"
        variants={variants}
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
