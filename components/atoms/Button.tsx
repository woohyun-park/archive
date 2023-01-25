import { MouseEventHandler } from "react";

interface IButtonProps {
  children?: React.ReactNode;
  type?: "button" | "reset" | "submit" | undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ children, type, onClick }: IButtonProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className="inline-block px-4 py-2.5 text-xs font-medium text-white uppercase transition duration-150 ease-in-out bg-black rounded-lg shadow-md leading-tigt ext-center hover:bg-black-f hover:shadow-lg focus:bg-black-f focus:shadow-lg focus:outline-none focus:ring-0 active:bg-black-f active:shadow-lg min-w-fit"
      >
        {children}
      </button>
    </>
  );
}
