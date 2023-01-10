import { useRouter } from "next/router";
import { HiArrowLeft } from "react-icons/hi";
import { SIZE, COLOR } from "../custom";

export default function Back({}) {
  const router = useRouter();

  return (
    <>
      <div className="cont">
        <div className="back" onClick={() => router.back()}>
          <HiArrowLeft size={SIZE.icon} />
        </div>
      </div>

      <style jsx>{`
        .cont {
          display: flex;
          justify-content: space-between;
          padding-top: 48px;
          background-color: ${COLOR.bg1};
          width: calc(100% + 32px);
          max-width: 480px;
          transform: translateX(-16px);
        }
        .cont > div {
          margin: 16px;
        }
        .back:hover,
        .more:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
