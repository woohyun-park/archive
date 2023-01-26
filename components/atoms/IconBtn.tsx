import {
  HiXMark,
  HiHeart,
  HiOutlineHeart,
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
  HiArrowLeft,
  HiPencil,
} from "react-icons/hi2";
import { SIZE } from "../../custom";

interface IIconBtnProps {
  type: "like" | "comment" | "scrap" | "back" | "delete" | "modify";
  fill?: boolean;
  size?: string;
  onClick?: () => void;
}

export default function IconBtn({
  type,
  fill = false,
  size = SIZE.icon,
  onClick = () => {},
}: IIconBtnProps) {
  return (
    <>
      {type === "like" && (
        <>
          {fill ? (
            <HiHeart size={size} onClick={onClick} />
          ) : (
            <HiOutlineHeart size={size} onClick={onClick} />
          )}
        </>
      )}
      {type === "comment" && (
        <HiOutlineChatBubbleOvalLeft size={size} onClick={onClick} />
      )}
      {type === "scrap" && (
        <>
          {fill ? (
            <HiBookmark size={size} onClick={onClick} />
          ) : (
            <HiOutlineBookmark size={size} onClick={onClick} />
          )}
        </>
      )}
      {type === "back" && (
        <>
          <div className="flex justify-between bg-bg1">
            <div className="my-4 hover:cursor-pointer" onClick={onClick}>
              <HiArrowLeft size={size} />
            </div>
          </div>
        </>
      )}
      {type === "delete" && (
        <div className="hover:cursor-pointer" onClick={onClick}>
          <HiXMark size={size} />
        </div>
      )}
      {type === "modify" && (
        <div
          className="flex items-center hover:cursor-pointer"
          onClick={onClick}
        >
          <HiPencil size={size} />
        </div>
      )}
    </>
  );
}
