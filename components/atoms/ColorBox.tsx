import { Children } from "react";
import { HiCheck } from "react-icons/hi2";
import { COLOR, SIZE } from "../../apis/interface";

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
      {Children.toArray(
        colors.map((arr, i) => (
          <div
            className={
              i === colors.length - 1
                ? "flex justify-between mb-4"
                : "flex justify-between mb-2"
            }
          >
            {arr.map((e) => (
              <div
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
        ))
      )}
    </>
  );
}
