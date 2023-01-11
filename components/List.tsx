import { useState } from "react";
import Image from "./Image";
import { COLOR, IPost, IUser, IStyle, IDict, SIZE } from "../custom";
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
  scrap: IPost[];
}

const TAB: IDict<string[]> = {
  search: ["post", "tag", "people"],
  profile: ["grid", "tag", "scrap"],
};

export default function List({ data, style }: IListProps) {
  const [selected, setSelected] = useState({
    tab: 1,
    tag: "",
  });

  return (
    <>
      <div className="postTypes">
        {TAB[style].map((e, i) => (
          <div onClick={() => setSelected({ ...selected, tab: i + 1 })} key={i}>
            {e}
          </div>
        ))}
      </div>
      <div className="postCont">
        {style === "search" ? (
          <>
            {selected.tab === 1 &&
              (data as IDataSearch).post.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))}
            {(() => {
              const tags = (data as IDataSearch).tag;
              if (selected.tab !== 2) {
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
                    <div className="tagBack">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, tag: "" })}
                      />
                    </div>
                    <div className="tagCont">
                      {tags[selected.tag].map((e) => (
                        <Image post={e} style="profile" />
                      ))}
                    </div>
                  </>
                );
              }
            })()}
            {selected.tab === 3 &&
              (data as IDataSearch).people.map((e) => (
                <ProfileSmall user={e} style={`${style}`} key={e.uid} />
              ))}
          </>
        ) : style === "profile" ? (
          <>
            {selected.tab === 1 &&
              (data as IDataProfile).grid.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))}
            {(() => {
              const tags = (data as IDataProfile).tag;
              if (selected.tab !== 2) {
                return <></>;
              } else if (selected.tag === "") {
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
              } else {
                return (
                  <>
                    <div className="tagBack">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, tag: "" })}
                      />
                    </div>
                    <div className="tagCont">
                      {tags[selected.tag].map((e) => (
                        <Image post={e} style="profile" />
                      ))}
                    </div>
                  </>
                );
              }
            })()}
            {selected.tab === 3 &&
              (data as IDataProfile).scrap.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))}
          </>
        ) : (
          <></>
        )}
      </div>

      <style jsx>{`
        .postCont {
          display: flex;
          flex-wrap: wrap;
          flex-direction: ${style === "search" && selected.tab === 3
            ? "column"
            : ""};
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
        .tagCont {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        }
        .tagBack {
          margin-bottom: 8px;
        }
        .tagBack:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
