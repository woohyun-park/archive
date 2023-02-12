import { ClassAttributes, CSSProperties, MouseEventHandler } from "react";

interface IButtonProps {
  label: string;
  type?: "button" | "reset" | "submit" | undefined;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  size?: "sm" | "base";
}

export default function Btn({
  label,
  type,
  style,
  onClick,
  isActive = true,
  size = "base",
}: IButtonProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className={
          size === "sm"
            ? isActive
              ? "button-sm"
              : "button-sm-inactive"
            : size === "base"
            ? isActive
              ? "button-base"
              : "button-base-inactive"
            : ""
        }
        style={style}
      >
        {label}
      </button>
    </>
  );
}
