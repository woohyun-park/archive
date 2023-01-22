import { useState } from "react";
import Box from "./Box";
import { IPost, IUser, IStyle, IDict, SIZE } from "../custom";
import { HiArrowLeft } from "react-icons/hi";
import Cont from "./Cont";

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
      <div className="grid grid-cols-3 gap-x-2 gap-y-2">
        {tab.map((each, i) => {
          const [key, type] = each;
          if (selected.tab === i) {
            if (type === "post") {
              return data[key].map((e: IPost) => (
                <Box
                  post={{ ...e, id: e.id }}
                  style={`${style}`}
                  key={e.id}
                ></Box>
              ));
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
                </>
              );
            }
            // TODO: cont를 클릭했을때 화면이 위로 가는현상 고치기
            else if (type === "cont") {
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
                </>
              );
            }
          }
        })}
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
