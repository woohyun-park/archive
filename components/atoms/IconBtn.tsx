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
import { IoRefreshSharp } from "react-icons/io5";
import { SIZE } from "../../custom";

interface IIconBtnProps {
  type: "like" | "comment" | "scrap" | "back" | "delete" | "modify" | "refresh";
  fill?: boolean;
  size?: string;
  style?: string;
  onClick?: () => void;
}

export default function IconBtn({
  type,
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
        {type === "back" && <HiArrowLeft size={size} onClick={onClick} />}
        {type === "delete" && <HiXMark size={size} onClick={onClick} />}
        {type === "modify" && <HiPencil size={size} onClick={onClick} />}
        {type === "refresh" && <IoRefreshSharp size={size} onClick={onClick} />}
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
