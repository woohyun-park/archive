import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

interface IButtonProps {
  label: string;
  type?: "button" | "submit";
  isActive?: boolean;
  size?: "base" | "sm";
  width?: "fit" | "full";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const btn_base =
  "flex items-center justify-center h-10 px-2 py-2 text-base text-center text-white transition duration-150 ease-in-out bg-black rounded-lg hover:bg-black-f focus:bg-black-f focus:outline-none focus:ring-0 active:bg-black-f min-w-fit";
const btn_sm = twMerge(btn_base, "h-8 px-4 text-sm");
const btn_inactive =
  "text-black bg-gray-3 hover:bg-gray-3f focus:bg-gray-3f active:bg-gray-3f";

export default function Button({
  label,
  type = "button",
  size = "base",
  width = "fit",
  isActive = true,
  className,
  onClick,
}: IButtonProps) {
  function getClassName() {
    let toFormat: string[] = [];
    console.log(size);
    if (size === "base") toFormat.push(btn_base);
    else if (size === "sm") toFormat.push(btn_sm);
    if (!isActive) toFormat.push(btn_inactive);
    if (width === "full") toFormat.push("w-full");
    console.log(toFormat);
    return twMerge(...toFormat, className || "");
  }

  return (
    <button type={type} onClick={onClick} className={getClassName()}>
      {label}
    </button>
  );
}
