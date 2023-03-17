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
        <svg className="absolute w-0 h-0">
          <clipPath id="my-clip-path" clipPathUnits="objectBoundingBox">
            <path d="M1,0.301 C1,0.135,0.872,0,0.714,0 C0.629,0,0.552,0.039,0.5,0.101 C0.448,0.039,0.371,0,0.286,0 C0.128,0,0,0.135,0,0.301 C0,0.377,0.027,0.447,0.072,0.5 C0.027,0.553,0,0.623,0,0.699 C0,0.865,0.128,1,0.286,1 C0.371,1,0.448,0.961,0.5,0.899 C0.552,0.961,0.629,1,0.714,1 C0.872,1,1,0.865,1,0.699 C1,0.623,0.973,0.553,0.928,0.5 C0.973,0.447,1,0.377,1,0.301"></path>
          </clipPath>
        </svg>

        <div className="w-full h-full" id="profileImg_d1"></div>
      </div>
      <style jsx>
        {`
          #profileImg_d1 {
            background: url(${photoURL});
            background-size: cover;
            clip-path: url(#my-clip-path);
          }
        `}
      </style>
    </>
  );
}
