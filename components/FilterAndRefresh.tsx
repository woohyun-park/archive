import { AnimatePresence } from "framer-motion";
import { SIZE } from "../libs/custom";
import { fadeVariants } from "../libs/motionLib";
import Input from "./atoms/Input";
import { motion } from "framer-motion";
import IconBtn from "./atoms/IconBtn";
import { ChangeEvent, useState } from "react";

interface IFilterAndRefresh {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  keyword: string;
}

export default function FilterAndRefresh({
  onChange,
  onCancel,
  keyword,
}: IFilterAndRefresh) {
  const [isOpen, setIsOpen] = useState(keyword.length === 0 ? false : true);

  return (
    <>
      <div className="relative flex items-center px-4 py-2 mt-4">
        <div
          className={
            isOpen
              ? "z-10 left-[1.125rem] scale-75 duration-100 ease-in-out absolute top-[1.125rem]"
              : "z-10 duration-100 ease-in-out"
          }
        >
          <IconBtn
            icon="filter"
            size={SIZE.iconSm}
            onClick={() => {
              setIsOpen(!isOpen);
              onCancel();
            }}
          />
        </div>
        {isOpen && (
          <div
            className="absolute z-10 top-[1.125rem] right-6 hover:cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              onCancel();
            }}
          >
            취소
          </div>
        )}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="feed_input"
              className="top-0 z-0 w-full"
              variants={fadeVariants}
            >
              <Input
                type="text"
                value={keyword}
                onChange={onChange}
                style="padding-left: 1.5rem"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
