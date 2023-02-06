import {
  HiXMark,
  HiHeart,
  HiOutlineHeart,
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiChevronLeft,
  HiPencil,
  HiMagnifyingGlass,
  HiOutlineBell,
  HiArrowUturnLeft,
  HiOutlineFunnel,
  HiCog8Tooth,
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
  | "setting";

interface IIconBtnProps {
  icon: IIcon;
  fill?: boolean;
  size?: string;
  style?: string;
  onClick?: () => void;
}

export default function IconBtn({
  icon,
  fill = false,
  size = SIZE.icon,
  style,
  onClick = () => {},
}: IIconBtnProps) {
  return (
    <>
      <div
        id="iconBtn_b1"
        className="flex items-center justify-center transition duration-150 ease-in-out hover:cursor-pointer"
      >
        {icon === "like" && (
          <>
            {fill ? (
              <HiHeart size={size} onClick={onClick} />
            ) : (
              <HiOutlineHeart size={size} onClick={onClick} />
            )}
          </>
        )}
        {icon === "comment" && (
          <HiOutlineChatBubbleOvalLeft size={size} onClick={onClick} />
        )}
        {icon === "scrap" && (
          <>
            {fill ? (
              <HiBookmark size={size} onClick={onClick} />
            ) : (
              <HiOutlineBookmark size={size} onClick={onClick} />
            )}
          </>
        )}
        {icon === "back" && <HiChevronLeft size={size} onClick={onClick} />}
        {icon === "delete" && <HiXMark size={size} onClick={onClick} />}
        {icon === "modify" && <HiPencil size={size} onClick={onClick} />}
        {icon === "refresh" && (
          <HiArrowUturnLeft size={size} onClick={onClick} />
        )}
        {icon === "search" && (
          <HiMagnifyingGlass size={size} onClick={onClick} />
        )}
        {icon === "alarm" && <HiOutlineBell size={size} onClick={onClick} />}
        {icon === "filter" && <HiOutlineFunnel size={size} onClick={onClick} />}
        {icon === "setting" && <HiCog8Tooth size={size} onClick={onClick} />}
      </div>

      <style jsx>
        {`
          #iconBtn_b1 {
            ${style}
          }
        `}
      </style>
    </>
  );
}
