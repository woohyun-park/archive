import { MouseEventHandler, RefObject } from "react";

type Props = {
  value: string;
  isVisible: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  ref?: RefObject<HTMLDivElement>;
};

export default function ButtonAnimateWidth({
  value,
  isVisible,
  onClick,
  ref,
}: Props) {
  return (
    <div
      className={
        isVisible
          ? "flex items-center justify-end ml-3 mr-1 min-w-fit hover:cursor-pointer duration-300"
          : "flex items-center justify-end hover:cursor-pointer"
      }
      onClick={onClick}
      ref={ref}
    >
      {isVisible ? value : ""}
    </div>
  );
}
