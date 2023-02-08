import { AnimatePresence } from "framer-motion";
import { SIZE } from "../libs/custom";
import { fadeVariants } from "../libs/motionLib";
import Input from "./atoms/Input";
import { motion } from "framer-motion";
import IconBtn from "./atoms/IconBtn";
import { useState } from "react";

interface IFilterAndRefresh {
  tag: string;
  setTag: React.Dispatch<React.SetStateAction<string>>;
  onRefresh: () => void;
}

export default function FilterAndRefresh({
  tag,
  setTag,
  onRefresh,
}: IFilterAndRefresh) {
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.value.slice(e.target.value.length - 1) !== " ")
      setTag(e.target.value);
  }

  const filter = (
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
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );

  return (
    <>
      <div className="relative flex items-center px-4 py-2 border-b-2 border-dotted border-gray-4f">
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
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {isOpen ? (
          <div
            className="absolute z-10 top-[1.125rem] right-6 hover:cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              setTag("");
            }}
          >
            취소
          </div>
        ) : (
          <IconBtn icon="refresh" size={SIZE.iconSm} onClick={onRefresh} />
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
                value={tag}
                onChange={handleChange}
                style="padding-left: 1.5rem"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
