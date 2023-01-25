import { MouseEventHandler } from "react";

interface IBackProps {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function BlockButton({ children, type, onClick }: IBackProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="
        p-2 ext-center rounded-lg
        inline-block w-full px-6 py-2.5 bg-black
         text-white font-medium text-xs leading-tight uppercase 
         shadow-md hover:bg-black-f hover:shadow-lg
          focus:bg-black-f focus:shadow-lg focus:outline-none 
          focus:ring-0 active:bg-black-f active:shadow-lg 
          transition duration-150 ease-in-out"
      >
        {children}
      </button>
    </>
  );
}
