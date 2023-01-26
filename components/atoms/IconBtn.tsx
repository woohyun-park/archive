import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import {
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineChatBubbleOvalLeft,
} from "react-icons/hi2";
import { IType, SIZE } from "../../custom";

interface IIconBtnProps {
  type: IType;
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
    </>
  );
}
