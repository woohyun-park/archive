import { motion, Variants } from "framer-motion";
import { HTMLInputTypeAttribute, Ref } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
interface IIconInputProps {
  children?: React.ReactNode;
  icon?: "search";
  type?: HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<SVGElement>;
  variants?: Variants;
  ref?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
  style?: string;
  size?: string;
}

export default function IconInput({
  type,
  icon,
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  variants,
  ref,
  autoFocus,
  style,
  size,
  onClick,
}: IIconInputProps) {
  return (
    <>
      <div className="w-full">
        {icon === "search" && (
          <HiMagnifyingGlass
            size={size}
            onClick={onClick}
            className="absolute my-3.5 ml-2"
          />
        )}
        <motion.input
          type={type}
          className="block w-full px-2 py-1 my-1 text-base font-normal border-2 border-solid rounded-lg pl-7 form-control text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3f focus:outline-none"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          // initial="initial"
          // // animate="animate"
          // whileFocus="whileFocus"
          // // exit="exit"
          // variants={variants}
          initial={false}
          animate={{
            width: "100%",
          }}
          whileFocus={{
            width: "100%",
            transition: {
              duration: 0.3,
            },
          }}
          ref={ref}
          autoFocus={autoFocus}
          id="input_i1"
        />
      </div>

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
