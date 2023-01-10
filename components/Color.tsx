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
      <div className="color" color={color} onClick={onClick}>
        {selected ? (
          <>
            <HiCheck size={SIZE.icon} color={COLOR.txtDark1} />
          </>
        ) : (
          <></>
        )}
      </div>

      <style jsx>
        {`
          .color {
            width: 48px;
            height: 48px;
            border-radius: 8px;
            background-color: ${color};
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </>
  );
}
