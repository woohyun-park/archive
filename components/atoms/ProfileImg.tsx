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
          className={onClick ? "profileImg-sm cursor-pointer" : "profileImg-sm"}
          onClick={onClick}
        >
          <Image src={photoURL} alt="" fill />
        </div>
      )}
      {size === "base" && (
        <div
          className={
            onClick ? "profileImg-base hover:cursor-pointer" : "profileImg-base"
          }
          onClick={onClick}
        >
          <Image src={photoURL} alt="" fill className="object-cover" />
        </div>
      )}
    </>
  );
}
