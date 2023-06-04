import {
  HiArrowUturnLeft,
  HiBookmark,
  HiChevronDown,
  HiChevronLeft,
  HiChevronUp,
  HiCog8Tooth,
  HiHeart,
  HiMagnifyingGlass,
  HiOutlineBell,
  HiOutlineBellAlert,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineFunnel,
  HiOutlineHeart,
  HiOutlinePencil,
  HiOutlineTrash,
  HiXMark,
} from "react-icons/hi2";

import { IIcon } from "types/common";
import { SIZE } from "apis/def";
import { twMerge } from "tailwind-merge";

type Props = {
  icon: IIcon;

  className?: string;
  fill?: boolean;
  size?: "base" | "sm" | "xs";
  onClick?: () => void;
};

export default function Icon({
  icon,

  className = "",
  fill = false,
  size = "base",
  onClick = () => {},
}: Props) {
  const getSize = () => {
    if (size === "base") return SIZE.icon;
    if (size === "sm") return SIZE.iconSm;
    if (size === "xs") return SIZE.iconXs;
  };

  const iconSize = getSize();

  return (
    <div
      className={twMerge(
        "w-fit transition duration-150 ease-in-out hover:cursor-pointer",
        className
      )}
    >
      {icon === "alarm" && fill && (
        <HiOutlineBellAlert size={iconSize} onClick={onClick} strokeWidth={2} />
      )}
      {icon === "alarm" && !fill && <HiOutlineBell size={iconSize} onClick={onClick} />}

      {icon === "back" && <HiChevronLeft size={iconSize} onClick={onClick} />}

      {icon === "comment" && <HiOutlineChatBubbleOvalLeft size={iconSize} onClick={onClick} />}

      {icon === "delete" && <HiOutlineTrash size={iconSize} onClick={onClick} />}

      {icon === "down" && <HiChevronDown size={iconSize} onClick={onClick} />}

      {icon === "filter" && <HiOutlineFunnel size={iconSize} onClick={onClick} />}

      {icon === "like" && fill && <HiHeart size={iconSize} onClick={onClick} />}
      {icon === "like" && !fill && <HiOutlineHeart size={iconSize} onClick={onClick} />}

      {icon === "modify" && <HiOutlinePencil size={iconSize} onClick={onClick} />}

      {icon === "refresh" && <HiArrowUturnLeft size={iconSize} onClick={onClick} />}

      {icon === "scrap" && fill && <HiBookmark size={iconSize} onClick={onClick} />}
      {icon === "scrap" && !fill && <HiOutlineBookmark size={iconSize} onClick={onClick} />}

      {icon === "search" && <HiMagnifyingGlass size={iconSize} onClick={onClick} />}

      {icon === "setting" && <HiCog8Tooth size={iconSize} onClick={onClick} />}

      {icon === "up" && <HiChevronUp size={iconSize} onClick={onClick} />}

      {icon === "x" && <HiXMark size={iconSize} onClick={onClick} />}
    </div>
  );
}
