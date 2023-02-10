import { ClassAttributes, CSSProperties, MouseEventHandler } from "react";

interface IButtonProps {
  label: string;
  type?: "button" | "reset" | "submit" | undefined;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Btn({ label, type, style, onClick }: IButtonProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="button-base"
        style={style}
      >
        {label}
      </button>
    </>
  );
}
