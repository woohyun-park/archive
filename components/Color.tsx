import { HiCheck } from "react-icons/hi";
import { COLOR, SIZE } from "../custom";

interface IColorProps {
  color: string;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Color({ color, selected, onClick }: IColorProps) {
  return (
    <>
      <div
        className="d1 w-12 h-12 rounded-lg flex justify-center items-center"
        color={color}
        onClick={onClick}
      >
        {selected ? <HiCheck size={SIZE.icon} color={COLOR.txtDark1} /> : <></>}
      </div>

      <style jsx>
        {`
          .d1 {
            background-color: ${color};
          }
        `}
      </style>
    </>
  );
}
