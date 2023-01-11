import { useState } from "react";
import Image from "./Image";
import { COLOR, IPost, IUser, IStyle, IDict } from "../custom";
import ProfileSmall from "./ProfileSmall";
import ListTag from "./ListTag";
import { HiArrowLeft, HiBackspace } from "react-icons/hi";

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

const BOX: IDict<string[]> = {
  search: ["post", "tag", "people"],
  profile: ["grid", "tag", "scrap"],
};

export default function List({ data, style }: IListProps) {
  console.log(data);
  const [selected, setSelected] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>("");

  return (
    <>
      <div className="postTypes">
        {BOX[style].map((e, i) => (
          <div onClick={() => setSelected(i + 1)} key={i}>
            {e}
          </div>
        ))}
      </div>
      <div className="postCont">
        {style === "search" ? (
          <>
            {selected === 1 &&
              (data as IDataSearch).post.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))}
            {/* {selected === 2 &&
              (data as IDataSearch).tag.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))} */}
            {(() => {
              if (selected !== 2) {
                return <></>;
              }
              const result = [];
              for (const tag in (data as IDataSearch).tag) {
                result.push(<div>{tag[0]}</div>);
              }
              return result;
            })()}
            {selected === 3 &&
              (data as IDataSearch).people.map((e) => (
                <ProfileSmall user={e} style={`${style}`} key={e.uid} />
              ))}
          </>
        ) : style === "profile" ? (
          <>
            {selected === 1 &&
              (data as IDataProfile).grid.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))}
            {/* {selected === 2 &&
              (data as IDataProfile).tag.map((e) => (
                <Image
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Image>
              ))} */}
            <div className="tagCont">
              {(() => {
                const result = [];
                const tags = (data as IDataProfile).tag;
                if (selected !== 2) {
                  return <></>;
                } else if (selectedTag === "") {
                  for (const tag in tags) {
                    result.push(
                      <ListTag
                        uid={(tags[tag][0] as IPost).uid}
                        tag={tag}
                        onClick={() => setSelectedTag(tag)}
                      />
                    );
                  }
                } else {
                  return (
                    <>
                      <HiArrowLeft onClick={() => setSelectedTag("")} />
                      {tags[selectedTag].map((e) => (
                        <Image post={e} style="profile" />
                      ))}
                    </>
                  );
                }

                return result;
              })()}
            </div>

            {selected === 3 &&
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
          flex-direction: ${style === "search" && selected === 3
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
          justify-content: space-between;
        }
      `}</style>
    </>
  );
}
