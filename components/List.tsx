import { useState } from "react";
import Box from "./Box";
import { COLOR, IPost, IUser, IStyle, IDict, SIZE, DEFAULT } from "../custom";
import ProfileSmall from "./ProfileSmall";
import { HiArrowLeft } from "react-icons/hi";
import Cont from "./Cont";

interface IListProps {
  data: IDataSearch | IDataProfile;
  style: IStyle;
}

interface IDataSearch {
  post: IPost[];
  tag: IDict<IPost[]>;
  people: IUser[];
}

interface IDataProfile {
  grid: IPost[];
  tag: IDict<IPost[]>;
  scrap: IDict<IPost[]>;
}

const TAB: IDict<string[]> = {
  search: ["post", "tag", "people"],
  profile: ["grid", "tag", "scrap"],
};

export default function List({ data, style }: IListProps) {
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
      <div className="grid grid-cols-3 gap-x-2 gap-y-2">
        {style === "search" ? (
          <>
            {selected.tab === 0 &&
              (data as IDataSearch).post.map((e) => (
                <Box
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Box>
              ))}
            {(() => {
              const tags = (data as IDataSearch).tag;
              if (selected.tab !== 1) {
                return <></>;
              }
              // 현재 선택된 tag가 없으면 모든 tag를 표시한다
              else if (selected.tag === "") {
                const result = [];
                for (const tag in tags) {
                  result.push(
                    <Cont
                      tag={tag}
                      posts={tags[tag]}
                      onClick={() => setSelected({ ...selected, tag })}
                    />
                  );
                }
                return result;
              }
              // 현재 선택된 tag가 있으면 해당 tag를 가진 post를 표시한다
              else {
                return (
                  <>
                    <div className="mb-2 hover:cursor-pointer">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, tag: "" })}
                      />
                    </div>
                    <div className="flex flex-wrap w-full">
                      {tags[selected.tag].map((e) => (
                        <Box post={e} style="profile" key={e.id} />
                      ))}
                    </div>
                  </>
                );
              }
            })()}
            {selected.tab === 2 &&
              (data as IDataSearch).people.map((e) => (
                <ProfileSmall user={e} style={`${style}`} key={e.id} />
              ))}
          </>
        ) : style === "profile" ? (
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
                    <div className="mb-2 hover:cursor-pointer">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, tag: "" })}
                      />
                    </div>
                    <div className="flex flex-wrap w-full">
                      {tags[selected.tag].map((e) => (
                        <Box post={e} style="profile" key={e.id} />
                      ))}
                    </div>
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
                    <div className="mb-2 hover:cursor-pointer">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, scrap: "" })}
                      />
                    </div>
                    <div className="flex flex-wrap w-full">
                      {scraps[selected.scrap].map((e) => (
                        <Box post={e} style="profile" key={e.id} />
                      ))}
                    </div>
                  </>
                );
              }
            })()}
          </>
        ) : (
          <></>
        )}
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
