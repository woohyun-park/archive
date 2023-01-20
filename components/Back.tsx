import { useRouter } from "next/router";
import { HiArrowLeft } from "react-icons/hi";
import { SIZE, COLOR, IStyle } from "../custom";

interface IBackProps {
  style: IStyle;
}

export default function Back({ style }: IBackProps) {
  const router = useRouter();

  return (
    <>
      <div className={`d1 flex justify-between`}>
        <div
          className="my-4 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <HiArrowLeft size={SIZE.icon} />
        </div>
      </div>

      <style jsx>{`
        .d1 {
          padding-top: ${style === "post" ? "48px" : ""};
          background-color: ${COLOR.bg1};
        }
      `}</style>
    </>
  );
}
