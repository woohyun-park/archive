import { AnimatePresence } from "framer-motion";
import { SIZE } from "../../libs/custom";
import { fadeVariants } from "../../libs/motionLib";
import Input from "./Input";
import { motion } from "framer-motion";
import IconBtn from "./IconBtn";
import { ChangeEvent, MouseEvent, useState } from "react";

interface IIconInputProps {
  icon: "filter" | "search";
  keyword: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (e: MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: string;
}

export default function IconInput({
  icon,
  onChange,
  onDelete,
  onKeyDown,
  keyword,
  placeholder,
  style,
}: IIconInputProps) {
  return (
    <>
      <div className="relative flex items-center py-2 mt-4" id="iconInput_d1">
        <div className="absolute z-10 scale-75 left-1">
          <IconBtn icon={icon} size={SIZE.iconSm} />
        </div>
        {keyword && keyword.length !== 0 && (
          <div className="absolute z-10 scale-75 right-1" onClick={onDelete}>
            <IconBtn icon={"delete"} size={SIZE.iconSm} />
          </div>
        )}
        <AnimatePresence>
          <motion.div
            key="feed_input"
            className="top-0 z-0 w-full"
            variants={fadeVariants}
          >
            <Input
              type="text"
              placeholder={placeholder}
              value={keyword}
              onChange={onChange}
              onKeyDown={onKeyDown}
              style="padding-left: 1.625rem; padding-right:1.625rem; font-size: 0.875rem;"
            />
          </motion.div>
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
}
