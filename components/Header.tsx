import { useRouter } from "next/router";
import { HiArrowLeft, HiDotsHorizontal } from "react-icons/hi";
import { COLOR, IPost } from "../custom";
import { SIZE } from "../custom";

type IHeaderProps = {
  post: IPost | null;
};

export default function Header({ post }: IHeaderProps) {
  const router = useRouter();
  return (
    <>
      <div className="cont">
        <div className="back" onClick={() => router.back()}>
          <HiArrowLeft size={SIZE.icon} />
        </div>
        <div className="more">
          <HiDotsHorizontal size={SIZE.icon} />
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
