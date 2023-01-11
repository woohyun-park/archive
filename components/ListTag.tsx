import Link from "next/link";
import { COLOR } from "../custom";

interface IListTagProps {
  uid: string;
  tag: string;
}

export default function ListTag({ uid, tag }: IListTagProps) {
  return (
    <>
      <div className="cont">
        <Link href={`/profile/${uid}/${tag}`}>
          <div className="bg"></div>
        </Link>
        <Link href={`/profile/${uid}/${tag}`} legacyBehavior>
          <a className="tag">
            <div>{`#${tag}`}</div>
          </a>
        </Link>
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
