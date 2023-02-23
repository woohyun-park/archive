import { CSSProperties, MouseEventHandler } from "react";

interface IButtonProps {
  label: string;
  type?: "button" | "submit" | "reset" | undefined;
  isActive?: boolean;
  size?: "base" | "sm";
  width?: "fit" | "full";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Btn({
  label,
  type = "button",
  size = "base",
  width = "fit",
  isActive = true,
  onClick,
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
      type={type}
      onClick={onClick}
      className={getClassName()}
    >
      {label}
    </button>
  );
}
