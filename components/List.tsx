import { useState } from "react";
import Box from "./Box";
import { IPost, IUser, IStyle, IDict, SIZE, ITag } from "../custom";
import { HiArrowLeft } from "react-icons/hi";
import Cont from "./Cont";
import MotionFloat from "../motions/motionFloat";
import ProfileSmall from "./ProfileSmall";
import { getData, getEach } from "../apis/firebase";

interface IListProps {
  data: IDict<any[] | IDict<any>>;
  style: IStyle;
  tab: string[][];
}

export default function List({ data, style, tab }: IListProps) {
  const [selected, setSelected] = useState<IDict<any>>({
    tab: 0,
    ...(() => {
      const result: IDict<string> = {};
      tab.map((each, i) => {
        const [key, value] = each;
        result[key] = "";
      });
      return result;
    })(),
  });
  // TODO: async는 render에서 부르지 못한다. 따라서 만약 tab에 tags가 있다면 useEffect같은걸로
  // state으로 데이터를 불러온 후에 렌더해줘야 한다.
  const [tags, setTags] = useState({});

  // async function displayTags(key: string) {
  //   console.log("displayTags");
  //   const list: IPost[] = [];
  //   for await (const each of (data[key] as IDict<ITag[]>)[selected[key]]) {
  //     const post = await getData<IPost>("posts", each.pid || "");
  //     list.push(post);
  //   }
  //   console.log("here!!!", list);
  //   const result = [];
  //   list.forEach((e: IPost) =>
  //     result.push(
  //       <Box post={{ ...e, id: e.id }} style={`${style}`} key={e.id}></Box>
  //     )
  //   );
  //   console.log(result);
  //   return list.map((e) => (
  //     <Box post={{ ...e, id: e.id }} style={`${style}`} key={e.id}></Box>
  //   ));
  //   return result;
  // }

  return (
    <>
      <div className="flex justify-around mb-4">
        {tab.map((each, i) => (
          <div
            className="w-full py-2 text-center border-b-2 text-gray-2 hover:cursor-pointer"
            id={selected.tab === i ? "d1" : ""}
            onClick={() => setSelected({ ...selected, tab: i })}
            key={i}
          >
            {each[0]}
          </div>
        ))}
      </div>
      {tab.map((each, i) => {
        const [key, type] = each;
        if (selected.tab === i) {
          if (type === "post") {
            return (
              <>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                  {data[key].map((e: IPost) => (
                    <Box
                      post={{ ...e, id: e.id }}
                      style={`${style}`}
                      key={e.id}
                    ></Box>
                  ))}
                </div>
              </>
            );
          } else if (type === "list") {
            return (
              <>
                {selected[key] !== "" && (
                  <div className="mb-2 hover:cursor-pointer">
                    <HiArrowLeft
                      size={SIZE.icon}
                      onClick={() => setSelected({ ...selected, [key]: "" })}
                    />
                  </div>
                )}
                {selected[key] === "" ? (
                  <>
                    {(() => {
                      const result = [];
                      for (const each in data[key]) {
                        result.push(
                          <div
                            onClick={() =>
                              setSelected({ ...selected, [key]: each })
                            }
                          >
                            {each}
                          </div>
                        );
                      }
                      return result;
                    })()}
                  </>
                ) : (
                  <>
                    {/* {displayTags(key)} */}
                    {test()}

                    {/* {
                    (data[key] as IDict<ITag[]>)[selected[key] as string].map(
                      (each) => (
                        <div key={each.id}>{each.pid}</div>
                      )
                    )} */}
                  </>
                )}
              </>
            );
          }
          // TODO: cont를 클릭했을때 화면이 위로 가는현상 고치기
          else if (type === "cont") {
            return (
              <>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                  {selected[key] !== "" && (
                    <div className="mb-2 hover:cursor-pointer">
                      <HiArrowLeft
                        size={SIZE.icon}
                        onClick={() => setSelected({ ...selected, [key]: "" })}
                      />
                    </div>
                  )}
                  {(() => {
                    const datas = data[key] as IDict<any>;
                    if (selected[key] === "") {
                      const result = [];
                      for (const data in datas) {
                        result.push(
                          <Cont
                            tag={data}
                            posts={datas[data]}
                            onClick={() =>
                              setSelected({ ...selected, [key]: data })
                            }
                          />
                        );
                      }
                      return result;
                    } else {
                      return (
                        <>
                          {datas[selected[key]].map((e: IPost) => (
                            <Box post={e} style="profile" key={e.id} />
                          ))}
                        </>
                      );
                    }
                  })()}
                </div>
              </>
            );
          } else if (type === "user") {
            return (
              <>
                {data[key].map((user: IUser) => (
                  <MotionFloat key={user.id}>
                    <ProfileSmall user={user} style="search" key={user.id} />
                  </MotionFloat>
                ))}
              </>
            );
          }
        }
      })}

      <style jsx>{`
        #d1 {
          font-weight: bold;
          color: black;
        }
      `}</style>
    </>
  );
}
