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
      <div className="cont">
        <div className="btnCont" onClick={() => router.back()}>
          <HiArrowLeft size={SIZE.icon} />
        </div>
      </div>

      <style jsx>{`
        .cont {
          display: flex;
          justify-content: space-between;
          padding-top: ${style === "post" ? "48px" : ""};
          background-color: ${COLOR.bg1};
          width: calc(100% + 32px);
          max-width: 480px;
          transform: translateX(-16px);
        }
        .btnCont {
          margin: 16px;
        }
        .btnCont:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
