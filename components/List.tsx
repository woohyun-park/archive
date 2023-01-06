import { useState } from "react";
import Image from "./Image";
import { COLOR, IPost } from "../custom";

interface IListProps {
  posts: IPost[];
  style: string;
}

interface IBox {
  [key: string]: string[];
}

const BOX: IBox = {
  search: ["post", "tag", "people"],
  profile: ["grid", "tag", "scrap"],
};

export default function List({ posts, style }: IListProps) {
  const [selected, setSelected] = useState(1);
  return (
    <>
      <div className="postTypes">
        {BOX[style].map((e, i) => (
          <div onClick={() => setSelected(i + 1)}>{e}</div>
        ))}
      </div>
      <div className="postCont">
        {selected === 1 ? (
          posts?.map((e) => {
            return <Image post={{ ...e, id: e.id }} style={`${style}`}></Image>;
          })
        ) : selected === 2 ? (
          // Posts by tag
          <></>
        ) : (
          // Posts by scrap
          <></>
        )}
      </div>
      <style jsx>{`
        .postCont {
          display: flex;
          flex-wrap: wrap;
        }
        .postTypes {
          display: flex;
          justify-content: space-around;
          margin-bottom: 16px;
        }
        .postTypes > div {
          width: 100%;
          text-align: center;
          border-bottom: 1px solid ${COLOR.txt3};
          padding: 8px 0;
        }
        .postTypes > div:hover {
          cursor: pointer;
        }
        .postTypes > div:nth-of-type(${selected}) {
          font-weight: 800;
          border-bottom: 2px solid ${COLOR.txt1};
        }
      `}</style>
    </>
  );
}
