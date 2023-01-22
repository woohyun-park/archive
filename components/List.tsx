import { useState } from "react";
import Box from "./Box";
import { IPost, IUser, IStyle, IDict, SIZE } from "../custom";
import ProfileSmall from "./ProfileSmall";
import { HiArrowLeft } from "react-icons/hi";
import Cont from "./Cont";

interface IListProps {
  data: IDataProfile;
  style: IStyle;
  tab: string[];
}

interface IDataProfile {
  grid: IPost[];
  tag: IDict<IPost[]>;
  scrap: IDict<IPost[]>;
}

interface ITab {
  name: string;
  style: string;
}

const TAB: IDict<string[]> = {
  profile: ["grid", "tag", "scrap"],
};

export default function List({ data, style, tab }: IListProps) {
  const [selected, setSelected] = useState({
    tab: 0,
    tag: "",
    scrap: "",
  });

  return (
    <>
      <div className="flex justify-around mb-4">
        {TAB[style].map((e, i) => (
          <div
            className="w-full py-2 text-center border-b-2 text-gray-2 hover:cursor-pointer"
            id={selected.tab === i ? "d1" : ""}
            onClick={() => setSelected({ ...selected, tab: i })}
            key={i}
          >
            {e}
          </div>
        ))}
      </div>
      {selected.tab === 1 && selected.tag !== "" && (
        <div className="mb-2 hover:cursor-pointer">
          <HiArrowLeft
            size={SIZE.icon}
            onClick={() => setSelected({ ...selected, tag: "" })}
          />
        </div>
      )}
      {selected.tab === 2 && selected.scrap !== "" && (
        <div className="mb-2 hover:cursor-pointer">
          <HiArrowLeft
            size={SIZE.icon}
            onClick={() => setSelected({ ...selected, scrap: "" })}
          />
        </div>
      )}
      <div className="grid grid-cols-3 gap-x-2 gap-y-2">
        <>
          {selected.tab === 0 &&
            (data as IDataProfile).grid.map((e) => (
              <Box
                post={{ ...e, id: e.id }}
                style={`${style}`}
                key={e.id}
              ></Box>
            ))}
          {(() => {
            const tags = (data as IDataProfile).tag;
            if (selected.tab !== 1) {
              return <></>;
            } else if (selected.tag === "") {
              const result = [];
              for (const tag in tags) {
                result.push(
                  <Cont
                    tag={tag}
                    posts={tags[tag]}
                    style="tag"
                    onClick={() => setSelected({ ...selected, tag })}
                  />
                );
              }
              return result;
            } else {
              return (
                <>
                  {tags[selected.tag].map((e) => (
                    <Box post={e} style="profile" key={e.id} />
                  ))}
                </>
              );
            }
          })()}
          {(() => {
            const scraps = (data as IDataProfile).scrap;
            if (selected.tab !== 2) {
              return <></>;
            } else if (selected.scrap === "") {
              const result = [];
              for (const scrap in scraps) {
                result.push(
                  <Cont
                    tag={scrap}
                    posts={scraps[scrap]}
                    onClick={() => setSelected({ ...selected, scrap })}
                  />
                );
              }
              return result;
            } else {
              return (
                <>
                  {scraps[selected.scrap].map((e) => (
                    <Box post={e} style="profile" key={e.id} />
                  ))}
                </>
              );
            }
          })()}
        </>
      </div>

      <style jsx>{`
        #d1 {
          font-weight: bold;
          color: black;
        }
      `}</style>
    </>
  );
}
