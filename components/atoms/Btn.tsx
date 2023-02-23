import { CSSProperties, MouseEventHandler } from "react";

interface IButtonProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  size?: "base" | "sm";
  width?: "fit" | "full";
}

export default function Btn({
  label,
  onClick,
  size = "base",
  width = "fit",
  isActive = true,
}: IButtonProps) {
  function getClassName() {
    let className = [];
    if (size === "sm") className.push("button-sm");
    else className.push("button-base");
    if (width === "full") className.push("w-full");
    if (!isActive) className.push("button-inactive");
    return className.join(" ");
  }
  return (
    <button
      id="btn_b1"
      type="button"
      onClick={onClick}
      className={getClassName()}
    >
      {label}
    </button>
  );
}
