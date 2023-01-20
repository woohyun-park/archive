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
    tab: 1,
    tag: "",
    scrap: "",
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
                <Box
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Box>
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
                        <Box post={e} style="profile" key={e.id} />
                      ))}
                    </div>
                  </>
                );
              }
            })()}
            {selected.tab === 3 &&
              (data as IDataSearch).people.map((e) => (
                <ProfileSmall user={e} style={`${style}`} key={e.id} />
              ))}
          </>
        ) : style === "profile" ? (
          <>
            {selected.tab === 1 &&
              (data as IDataProfile).grid.map((e) => (
                <Box
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Box>
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
                      style="tag"
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
                        <Box post={e} style="profile" key={e.id} />
                      ))}
                    </div>
                  </>
                );
              }
            })()}
            {(() => {
              const scraps = (data as IDataProfile).scrap;
              if (selected.tab !== 3) {
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
                    <div className="tagBack">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, scrap: "" })}
                      />
                    </div>
                    <div className="tagCont">
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
        .postCont {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          row-gap: 8px;
          column-gap: 8px;
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
        .postTypes > div:nth-of-type(${selected.tab}) {
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
