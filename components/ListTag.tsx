import Link from "next/link";
import { COLOR } from "../custom";
import Image from "./Image";

interface IListTagProps {
  uid: string;
  tag: string;
  onClick: () => void;
}

export default function ListTag({ uid, tag, onClick }: IListTagProps) {
  return (
    <>
      <div>
        <Image
          post={{
            id: "",
            uid: "",
            createdAt: new Date(),
            title: tag,
            txt: "",
            tags: [],
            imgs: [],
            color: "",
            likes: [],
            scraps: [],
            comments: [],
          }}
          style="tag"
          onClick={onClick}
        />
      </div>

      <style jsx>{`
         {
          /* .cont {
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
        } */
        }
        .cont {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          width: calc(50% - 8px);
          padding-bottom: calc(50% - 8px);
          margin: 4px;
        }
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding-bottom: 100%;
          object-fit: cover;
          background-color: ${COLOR.primary};
        }

        .tag {
          margin-bottom: 8px;
          text-decoration: none;
          color: ${COLOR.txt1};
          width: fit-content;
        }
        .bg:hover,
        .tag:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
