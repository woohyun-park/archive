import { AnimatePresence } from "framer-motion";
import { SIZE } from "../../libs/custom";
import { fadeVariants } from "../../libs/motionLib";
import Input from "./Input";
import { motion } from "framer-motion";
import IconBtn from "./IconBtn";
import { ChangeEvent, MouseEvent, useState } from "react";

interface IIconInputProps {
  icon: "filter";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (e: MouseEvent<HTMLDivElement>) => void;
  keyword: string;
  placeholder?: string;
}

export default function IconInput({
  icon,
  onChange,
  onDelete,
  keyword,
  placeholder,
}: IIconInputProps) {
  return (
    <>
      <div className="relative flex items-center px-4 py-2 mt-4">
        <div className="absolute z-10 scale-75 left-5">
          <IconBtn icon={icon} size={SIZE.iconSm} />
        </div>
        {keyword.length !== 0 && (
          <div className="absolute z-10 scale-75 right-5" onClick={onDelete}>
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
              style="padding-left: 1.625rem; padding-right:1.625rem; font-size: 0.875rem;"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
