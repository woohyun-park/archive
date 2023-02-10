import { HiCheck } from "react-icons/hi2";
import { COLOR, SIZE } from "../../libs/custom";

interface IColorBoxProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export default function ColorBox({
  selectedColor,
  setSelectedColor,
}: IColorBoxProps) {
  const colors = [
    ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal"],
    ["cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink"],
  ];
  return (
    <>
      {colors.map((arr, i) => (
        <div
          className={
            i === colors.length - 1
              ? "flex justify-between mb-4"
              : "flex justify-between mb-2"
          }
          key={i}
        >
          {arr.map((e) => (
            <div
              key={e}
              className="flex items-center justify-center w-12 h-12 rounded-lg hover:cursor-pointer"
              style={{ backgroundColor: COLOR[e] }}
              onClick={() => {
                console.timeLog(COLOR[e]);
                setSelectedColor(COLOR[e]);
              }}
            >
              {selectedColor === COLOR[e] ? (
                <HiCheck size={SIZE.icon} color={COLOR.white} />
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
