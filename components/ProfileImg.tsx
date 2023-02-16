import Image from "next/image";

interface IProfileImgProps {
  size: "sm" | "lg";
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
      <div
        className={
          size === "sm"
            ? onClick
              ? "profileImg-sm cursor-pointer"
              : "profileImg-sm"
            : size === "lg"
            ? onClick
              ? "profileImg-lg cursor-pointer"
              : "profileImg-lg"
            : ""
        }
        onClick={onClick}
      >
        <Image src={photoURL} alt="" fill className="object-cover" />
      </div>
    </>
  );
}
