import {
  HiHeart,
  HiOutlineHeart,
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiChevronLeft,
  HiMagnifyingGlass,
  HiOutlineBell,
  HiArrowUturnLeft,
  HiOutlineFunnel,
  HiCog8Tooth,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBellAlert,
  HiXMark,
} from "react-icons/hi2";
import { SIZE } from "../../libs/custom";

export type IIcon =
  | "like"
  | "comment"
  | "scrap"
  | "back"
  | "delete"
  | "modify"
  | "refresh"
  | "search"
  | "alarm"
  | "filter"
  | "setting"
  | "x";

interface IBtnIconProps {
  icon: IIcon;
  fill?: boolean;
  size?: string;
  stroke?: string;
  onClick?: () => void;
}

export default function BtnIcon({
  icon,
  fill = false,
  size = SIZE.icon,
  stroke,
  onClick,
}: IBtnIconProps) {
  return (
    <div className="flex items-center justify-center transition duration-150 ease-in-out hover:cursor-pointer">
      {icon === "like" && (
        <>
          {fill ? (
            <HiHeart size={size} onClick={onClick} strokeWidth={stroke} />
          ) : (
            <HiOutlineHeart
              size={size}
              onClick={onClick}
              strokeWidth={stroke}
            />
          )}
        </>
      )}
      {icon === "comment" && (
        <HiOutlineChatBubbleOvalLeft
          size={size}
          onClick={onClick}
          strokeWidth={stroke}
        />
      )}
      {icon === "scrap" && (
        <>
          {fill ? (
            <HiBookmark size={size} onClick={onClick} strokeWidth={stroke} />
          ) : (
            <HiOutlineBookmark
              size={size}
              onClick={onClick}
              strokeWidth={stroke}
            />
          )}
        </>
      )}
      {icon === "back" && (
        <HiChevronLeft size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "delete" && (
        <HiOutlineTrash size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "x" && (
        <HiXMark size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "modify" && (
        <HiOutlinePencil size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "refresh" && (
        <HiArrowUturnLeft size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "search" && (
        <HiMagnifyingGlass size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "alarm" && (
        <>
          {fill ? (
            <HiOutlineBellAlert
              size={size}
              onClick={onClick}
              strokeWidth={stroke}
            />
          ) : (
            <HiOutlineBell size={size} onClick={onClick} strokeWidth={stroke} />
          )}
        </>
      )}
      {icon === "filter" && (
        <HiOutlineFunnel size={size} onClick={onClick} strokeWidth={stroke} />
      )}
      {icon === "setting" && (
        <HiCog8Tooth size={size} onClick={onClick} strokeWidth={stroke} />
      )}
    </div>
  );
}
