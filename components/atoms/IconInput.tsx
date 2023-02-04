import { AnimatePresence, motion, Variants } from "framer-motion";
import React, { HTMLInputTypeAttribute, Ref, useRef } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { SIZE } from "../../libs/custom";
import { fadeVariants } from "../../libs/motionLib";
import IconBtn, { IIcon } from "./IconBtn";
interface IIconInputProps {
  children?: React.ReactNode;
  icon?: IIcon;
  type?: HTMLInputTypeAttribute;
  value?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: () => void;
  onRefreshClick?: React.MouseEventHandler<HTMLOrSVGElement>;
  onCancelClick?: React.MouseEventHandler<HTMLOrSVGElement>;
  autoFocus?: boolean;
  style?: string;
  size?: string;
  isOpen: boolean;
}

export default function IconInput({
  type,
  icon,
  value,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  autoFocus,
  style,
  size = SIZE.iconSm,
  isOpen,
  onRefreshClick,
  onCancelClick,
}: IIconInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const contRef = useRef<HTMLDivElement>(null);
  function onClick() {
    ref.current?.focus();
  }
  useOutsideClick({
    ref: contRef,
    onClick: () => {
      onBlur && onBlur();
      console.log("outside!");
    },
  });
  return (
    <>
      <div
        className={`relative flex items-center w-full ${
          isOpen ? "justify-between" : ""
        }`}
        ref={contRef}
      >
        <AnimatePresence>
          <>
            <div
              className={`z-10 duration-100 hover:cursor-pointer ${
                isOpen ? "scale-75" : "scale-100"
              }`}
            >
              <IconBtn icon={icon as IIcon} size={size} onClick={onClick} />
            </div>
            {/* <HiMagnifyingGlass
              size={size}
              onClick={onClick}
              className={`z-10 duration-100 hover:cursor-pointer ${
                isOpen ? "scale-75" : "scale-100"
              }`}
            /> */}
            {!isOpen && (
              <motion.div
                key="iconInput_refresh"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeVariants}
                onClick={onRefreshClick}
              >
                <IconBtn icon="refresh" size={size} />
              </motion.div>
            )}
            {isOpen && (
              <motion.div
                key="iconInput_cancel"
                className="z-10 flex items-center justify-end px-1 text-sm hover:cursor-pointer"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeVariants}
                onClick={onCancelClick}
              >
                취소
              </motion.div>
            )}
          </>
        </AnimatePresence>
        <motion.input
          type={type}
          className="absolute z-0 block my-1 text-base font-normal border-2 border-solid rounded-lg form-control text-gray-1 bg-gray-3 bg-clip-padding border-gray-3 focus:text-gray-1 focus:border-gray-3 focus:outline-none"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          initial={{
            opacity: 0,
            width: "0",
            paddingLeft: "0",
            paddingRight: "0",
          }}
          animate={{
            opacity: 0,
            width: "0",
            paddingLeft: "0",
            paddingRight: "0",
          }}
          whileFocus={{
            width: "100%",
            opacity: 1,
            transition: {
              duration: 0.3,
            },
            paddingLeft: "1.25rem",
            paddingRight: "2.25rem",
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
