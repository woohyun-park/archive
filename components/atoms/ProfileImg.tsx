import Image from "next/image";
interface IProfileImgProps {
  size: "sm" | "base";
  photoURL: string;
  onClick?: () => void;
}

export default function ProfileImg({
  size,
  photoURL,
  onClick,
}: IProfileImgProps) {
  return (
    <>
      {size === "sm" && (
        <div
          className={
            onClick
              ? "mr-1 profileImg-small cursor-pointer"
              : "mr-1 profileImg-small"
          }
          onClick={onClick}
        >
          <Image src={photoURL} alt="" fill />
        </div>
      )}
      {size === "base" && (
        <div
          className={
            onClick
              ? "relative object-cover w-24 h-24 overflow-hidden rounded-full hover:cursor-pointer"
              : "relative object-cover w-24 h-24 overflow-hidden rounded-full "
          }
          onClick={onClick}
        >
          <Image src={photoURL} alt="" fill className="object-cover" />
        </div>
      )}
    </>
  );
}
