import { MouseEventHandler } from "react";

interface IButtonProps {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit" | undefined;
  style?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Btn({ children, type, style, onClick }: IButtonProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="inline-block px-4 py-2.5 text-xs font-medium text-white
        transition duration-150 ease-in-out bg-black rounded-lg shadow-md leading-tigt ext-center
         hover:bg-black-f hover:shadow-lg focus:bg-black-f focus:shadow-lg focus:outline-none 
         focus:ring-0 active:bg-black-f active:shadow-lg min-w-fit"
        id="btn_b1"
      >
        {children}
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
