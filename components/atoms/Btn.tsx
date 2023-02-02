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
        className="inline-block px-4 py-3 text-base text-white transition duration-150 ease-in-out bg-black rounded-lg leading-tigt ext-center hover:bg-black-f focus:bg-black-f focus:outline-none focus:ring-0 active:bg-black-f min-w-fit"
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
