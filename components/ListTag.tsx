import Link from "next/link";
import { COLOR } from "../custom";

interface IListTagProps {
  uid: string;
  tag: string;
  onClick: () => void;
}

export default function ListTag({ uid, tag, onClick }: IListTagProps) {
  return (
    <>
      <div className="cont">
        <div className="bg" onClick={onClick}></div>
        <div onClick={onClick}>{`#${tag}`}</div>
      </div>

      <style jsx>{`
        .cont {
          width: calc(50% - 8px);
          display: flex;
          flex-direction: column;
        }
        .bg {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          border-radius: 8px;
          background-color: ${COLOR.primary};
          margin-bottom: 4px;
        }
        .tag {
          margin-bottom: 8px;
          text-decoration: none;
          color: ${COLOR.txt1};
        }
      `}</style>
    </>
  );
}
