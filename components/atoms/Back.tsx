import { useRouter } from "next/router";
import { HiArrowLeft } from "react-icons/hi";
import { SIZE } from "../../custom";

interface IBackProps {
  size?: string;
  onClick?: () => void;
}

export default function Back({
  size = SIZE.icon,
  onClick = () => {},
}: IBackProps) {
  return (
    <>
      <div className="flex justify-between bg-bg1">
        <div className="my-4 hover:cursor-pointer" onClick={onClick}>
          <HiArrowLeft size={size} />
        </div>
      </div>
    </>
  );
}
