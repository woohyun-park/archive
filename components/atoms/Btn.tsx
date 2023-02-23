import { CSSProperties, MouseEventHandler } from "react";
import { IDict } from "../../libs/custom";

interface IButtonProps {
  label: string;
  type?: "button" | "submit" | "reset" | undefined;
  isActive?: boolean;
  size?: "base" | "sm";
  width?: "fit" | "full";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const btn_base = [
  "flex items-center justify-center h-10 px-4 py-2 text-base text-center text-white transition duration-150 ease-in-out bg-black rounded-lg hover:bg-black-f focus:bg-black-f focus:outline-none focus:ring-0 active:bg-black-f min-w-fit",
];
const btn_sm = [...btn_base, "h-8 px-4 text-sm"];
const btn_inactive = [
  "text-black bg-gray-3 hover:bg-gray-3f focus:bg-gray-3f active:bg-gray-3f",
];

export default function Btn({
  label,
  type = "button",
  size = "base",
  width = "fit",
  isActive = true,
  className,
  onClick,
}: IButtonProps) {
  function mergeTailwindClasses(...classStrings: string[]) {
    let classHash: IDict<string> = {};
    classStrings.map((str) => {
      str
        .split(/\s+/g)
        .map((token) => (classHash[token.split("-")[0]] = token));
    });
    return Object.values(classHash).sort().join(" ");
  }
  function getClassName() {
    let toFormat: string[] = [];
    if (size === "base") toFormat.push(...btn_base);
    else if (size === "sm") toFormat.push(...btn_sm);
    if (!isActive) toFormat.push(...btn_inactive);
    if (width === "full") toFormat.push("w-full");
    return mergeTailwindClasses(...toFormat, className || "");
  }
  return (
    <button type={type} onClick={onClick} className={getClassName()}>
      {label}
    </button>
  );
}
