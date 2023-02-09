import { MouseEventHandler } from "react";

interface IButtonProps {
  label: string;
  type?: "button" | "reset" | "submit" | undefined;
  style?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Btn({ label, type, style, onClick }: IButtonProps) {
  return (
    <>
      <button type={type} onClick={onClick} className="button-base">
        {label}
      </button>

      <style jsx>
        {`
          #btn_b1 {
            ${style}
          }
        `}
      </style>
    </>
  );
}
