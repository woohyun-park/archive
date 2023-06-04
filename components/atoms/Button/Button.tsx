import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;

  type?: "button" | "submit";
  isActive?: boolean;
  width?: "fit" | "full";
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const base =
  "flex items-center h-8 px-4 text-sm justify-center py-2 text-sm text-center text-white transition duration-150 ease-in-out bg-black rounded-lg hover:bg-black-f focus:bg-black-f focus:outline-none focus:ring-0 active:bg-black-f min-w-fit";
const inactive = "text-black bg-gray-3 hover:bg-gray-3f focus:bg-gray-3f active:bg-gray-3f";
const full = "w-full";

export default function Button({
  label,
  type = "button",
  width = "fit",
  isActive = true,
  className = "",
  onClick = () => {},
}: Props) {
  const getClassName = () => {
    let toFormat: string[] = [base];
    if (!isActive) toFormat.push(inactive);
    if (width === "full") toFormat.push(full);
    return twMerge(...toFormat, className);
  };

  return (
    <button type={type} onClick={onClick} className={getClassName()}>
      {label}
    </button>
  );
}
